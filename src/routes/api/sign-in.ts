import type { RequestHandler } from '@sveltejs/kit';
import { createSession, getUserByEmail, validateUserCredentials } from '$lib/services/userService';
import { serialize } from 'cookie';

export const post: RequestHandler = async function ({ request }) {
	const { email, password } = await request.json();

	const isValid = await validateUserCredentials(email, password);
	const user = await getUserByEmail(email);

	// ⚠️ CAUTION: Do not store a plain passwords. Use proper hashing and salting.
	if (!isValid || !user) {
		return {
			status: 401,
			body: {
				message: 'Incorrect user or password'
			}
		};
	}

	const session = await createSession(user.id);

	if (!session) {
		return {
			status: 500,
			body: { message: 'Server error creating session' }
		};
	}

	const { id, expires } = session;
	return {
		status: 200,
		headers: {
			'Set-Cookie': serialize('session_id', id, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: true,
				expires
			})
		},
		body: {
			message: 'Successfully signed in'
		}
	};
};
