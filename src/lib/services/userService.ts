import prisma from '../providers/database';
import type { User } from '../providers/database';
import bcrypt from 'bcrypt';
import { signinSchema } from '../validators/authValidators';
import { logger } from '../utilities/logger';

const location = 'userService';

function getExpiryTime() {
	return new Date(new Date().getTime() + 30000);
}

export async function getUserByEmail(email: string) {
	return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string) {
	return await prisma.user.findUnique({ where: { id } });
}

export async function validateUserCredentials(email: string, password: string) {
	try {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) throw new Error('Email or password incorrect');
		const isAuthenticated = await bcrypt.compare(password, user.password);
		if (!isAuthenticated) throw new Error('Email or password incorrect');
		return true;
	} catch (error) {
		const message = (error as Error).message || 'An error occured during the register operation';
		logger(location, message);
		return false;
	}
}

export async function registerUser(user: Omit<User, 'id'>) {
	try {
		const { email, password } = signinSchema.parse(user);

		const users = await prisma.user.findMany({ where: { email } });

		if (users.length > 0) return Promise.reject(new Error('User already exists'));

		const hash = await bcrypt.hash(password, 12);

		const dbUser = await prisma.user.create({ data: { email, password: hash } });

		return Promise.resolve(dbUser);
	} catch (error) {
		const message = (error as Error).message || 'An error occured during the register operation';
		logger(location, message);
		return null;
	}
}

export async function createSession(userId: string) {
	try {
		const user = await prisma.user.findUnique({ where: { id: userId } });

		if (!user) return Promise.reject(new Error('User not found'));

		const expires = getExpiryTime();

		const session = await prisma.session.create({
			data: {
				userId: user.id,
				expires
			}
		});

		return session;
	} catch (error) {
		const message =
			(error as Error).message || 'An error occured during the create session operation';
		logger(location, message);
		return null;
	}
}

export async function getSession(id: string) {
	try {
		const session = await prisma.session.findUnique({ where: { id } });
		if (!session) throw new Error('Session not found');
		return session;
	} catch (error) {
		const message = (error as Error).message || 'An error occured during the get session operation';
		logger(location, message);
		return null;
	}
}

export async function removeSession(id: string) {
	try {
		await prisma.session.delete({ where: { id } });
		return true;
	} catch (error) {
		const message =
			(error as Error).message || 'An error occured during the delete session operation';
		logger(location, message);
		return false;
	}
}

export async function validateAndRefreshSession(sessionId: string) {
	try {
		const expires = getExpiryTime();
		const session = await prisma.session.update({
			where: {
				id: sessionId
			},
			data: {
				expires
			},
			include: {
				user: {
					select: {
						email: true
					}
				}
			}
		});

		return {
			sessionId: session.id,
			expiryTime: session.expires,
			userEmail: session.user.email
		};
	} catch (error) {
		const message =
			(error as Error).message ||
			'An error occured during the session validation and update operation';
		logger(location, message);
		return null;
	}
}
