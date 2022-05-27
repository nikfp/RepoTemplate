import { createSession, getUserByEmail, registerUser } from '$lib/services/userService';
import { serialize } from 'cookie';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async function ({ request }) {
	const { email, password } = await request.json();
	const user = await getUserByEmail(email);

	if (user) {
		return {
			status: 409,
			body: {
				message: 'User already exists'
			}
		};
	}

	const newUser = await registerUser({
		email,
		password
	});

	if (!newUser) {
		return {
			status: 500,
			body: { message: 'Failed to register user' }
		};
	}

	const session = await createSession(newUser.id);

	if (!session) {
		return {
			status: 500,
			body: { message: 'Failed to created session' }
		};
	}

	const { id, expires } = session;
	return {
		status: 201,
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
			message: 'Successfully signed up'
		}
	};
};
