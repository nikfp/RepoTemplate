import type { Session, User } from '@prisma/client';
import { describe, expect, it, beforeEach, afterEach, beforeAll } from 'vitest';

import { prismaMock } from '../../testutils/singleton.setup';
import {
	createSession,
	getSession,
	getUserByEmail,
	getUserById,
	registerUser,
	removeSession,
	validateUserCredentials,
	validateAndRefreshSession
} from './userService';

const users: { [key: string]: { data: Omit<User, 'id'> } } = {
	one: {
		data: {
			email: 'test@test.com',
			password: 'password'
		}
	},
	two: {
		data: {
			email: 'test2@test.com',
			password: 'password'
		}
	}
};

beforeEach(async () => {
	const userData = Object.values(users);
	await Promise.all(
		userData.map(async ({ data }) => {
			return prismaMock.user.create({ data });
		})
	);
});

afterEach(async () => {
	await prismaMock.session.deleteMany();
	await prismaMock.user.deleteMany();
});

describe('check that users exist', async () => {
	it('has users', async () => {
		const dbUsers = await prismaMock.user.findMany();

		expect(dbUsers.length).to.equal(2);
	});
});

describe('userService', async () => {
	describe('getUserByEmail', async () => {
		it('gets correct user with valid email', async () => {
			const user = await getUserByEmail(users.one.data.email);

			expect(user).not.toBeNull();
			expect(user?.email).to.equal(users.one.data.email);
		});

		it('returns null for bad email', async () => {
			const user = await getUserByEmail('bademail@nowhere.com');

			expect(user).toBeNull();
		});
	});

	describe('getUserById', async () => {
		it('gets correct user with valid ID', async () => {
			const user = await prismaMock.user.create({
				data: {
					email: 'getById@test.com',
					password: 'testpassword'
				}
			});
			const { id } = user;

			const getUser = await getUserById(id);

			expect(getUser).not.toBeNull();
			expect(getUser).to.toEqual(user);
		});

		it('returns null with invalid id', async () => {
			const user = await getUserById('invalid');

			expect(user).toBeNull();
		});
	});

	describe('validateUserCredentials', async () => {
		const email = 'new@test.com';
		const password = 'password';

		beforeAll(async () => {
			await registerUser({ email, password });
		});

		it('returns true for valid credentials', async () => {
			const isValid = await validateUserCredentials(email, password);

			expect(isValid).to.equal(true);
		});

		it('returns false for incorrect password', async () => {
			const isValid = await validateUserCredentials(email, 'wrongpass');

			expect(isValid).to.equal(false);
		});

		it("returns false for user that doesn't exist", async () => {
			const isValid = await validateUserCredentials('wrong@test.com', password);

			expect(isValid).to.equal(false);
		});
	});

	describe('registerUser', async () => {
		const email = 'new@test.com';
		const password = 'password';

		let user: User | null = null;

		beforeAll(async () => {
			user = await registerUser({ email, password });
		});

		it('user registers without errors', async () => {
			expect(user).not.toBeNull();
			expect(user?.id).not.toBeUndefined();
		});

		it('user password has been hashed', async () => {
			if (!user) throw new Error('User not defined as expected before test run');

			expect(user.password).not.equal(password);
		});
	});

	describe('createSession', async () => {
		let user: User | null = null;

		beforeEach(async () => {
			user = await prismaMock.user.findFirst({ where: { email: users.one.data.email } });
		});

		afterEach(async () => {
			await prismaMock.session.deleteMany();
		});

		it('creates session for valid user ID', async () => {
			if (!user) throw new Error('User create operation failed during test build');

			const session = await createSession(user?.id);
			expect(session).not.toBeNull();
			expect(session?.userId).to.equal(user.id);
			expect(session?.expires).toBeDefined();
			expect(session?.expires.valueOf()).toBeGreaterThan(Date.now());
		});

		it('throws not found error for invalid user ID', async () => {
			if (!user) throw new Error('User create operation failed during test build');

			expect(createSession('badId')).rejects.toThrowError('User not found');
		});
	});

	describe('getSession', async () => {
		let session: Session | null = null;

		beforeEach(async () => {
			const user = await prismaMock.user.findFirst({ where: { email: users.one.data.email } });

			if (!user) throw new Error('User undefined');

			const { id } = user;

			session = await createSession(id);
		});

		it('returns session for valid ID', async () => {
			if (!session) throw new Error('Session undefined');
			const { id } = session;

			const fetchedSession = await getSession(id);

			expect(fetchedSession).not.toBeNull();
		});

		it('returns null for invalid ID', async () => {
			if (!session) throw new Error('Session undefined');

			const fetchedSession = await getSession('badId');

			expect(fetchedSession).toBeNull();
		});
	});

	describe('deleteSession', async () => {
		let session: Session | null = null;

		beforeEach(async () => {
			const user = await prismaMock.user.findFirst({ where: { email: users.one.data.email } });

			if (!user) throw new Error('User undefined');

			const { id } = user;

			session = await createSession(id);
		});

		it('returns true and deletes session for valid id', async () => {
			if (!session) throw new Error('Session undefined');
			const { id } = session;

			const deleted = await removeSession(id);

			const dbSession = await prismaMock.session.findFirst({ where: { id } });

			expect(deleted).to.equal(true);
			expect(dbSession).toBeNull();
		});

		it('returns false for invalid id, no session deleted', async () => {
			if (!session) throw new Error('Session undefined');

			const sessionCount = (await prismaMock.session.findMany()).length;

			expect(sessionCount).toBeGreaterThan(0);

			const deleted = await removeSession('badId');

			const newSessionCount = (await prismaMock.session.findMany()).length;

			expect(deleted).to.equal(false);
			expect(sessionCount).equal(newSessionCount);
		});
	});

	describe.only('validateAndRefreshSession', async () => {
		let session: Session | null = null;

		beforeEach(async () => {
			const user = await prismaMock.user.findFirst({ where: { email: users.one.data.email } });

			if (!user) throw new Error('User undefined');

			const { id } = user;

			session = await createSession(id);
		});

		it('returns null for invalid token', async () => {
			const result = await validateAndRefreshSession('bad input');

			expect(result).toBeNull();
		});

		it('returns session info for valid session', async () => {
			console.log(`SESSION IS: ${session}`);
			if (!session) throw new Error('Session not initialized');

			const result = await validateAndRefreshSession(session?.id);

			if (!result) throw new Error('Session information not found');

			const { sessionId, expiryTime } = result;

			expect(sessionId).toBeDefined();
			expect(expiryTime).toBeDefined();
		});

		it('returns session with updated expiry time', async () => {
			if (!session) throw new Error('Session not initialized');

			const { expires } = session;
			const initialTime = expires.valueOf();

			await sleep(1);

			const result = await validateAndRefreshSession(session.id);

			if (!result) throw new Error('Session information not found');

			const { expiryTime } = result;

			const updatedExpires = expiryTime.valueOf();

			expect(updatedExpires).toBeGreaterThan(initialTime);
		});
	});
});

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
