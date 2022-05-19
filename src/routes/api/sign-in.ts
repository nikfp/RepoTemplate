import type { RequestHandler } from '@sveltejs/kit';
import { createSession, getUserByEmail } from './_db';
import { serialize } from 'cookie';

export const post: RequestHandler = async function ({ request }) {
	const { email, password } = await request.json();
	console.warn(
		'WARNING - Please set project up for proper password hashing and salting. DO NOT CONTINUE TO PRODUCTION WITH INITIAL SETUP!'
	);

	const user = await getUserByEmail(email);

	// ⚠️ CAUTION: Do not store a plain passwords. Use proper hashing and salting.
	if (!user || user.password !== password) {
		return {
			status: 401,
			body: {
				message: 'Incorrect user or password'
			}
		};
	}

	const { id } = await createSession(email);
	return {
		status: 200,
		headers: {
			'Set-Cookie': serialize('session_id', id, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7 // one week
			})
		},
		body: {
			message: 'Successfully signed in'
		}
	};
};
