import { removeSession } from '$lib/services/userService';
import { parse, serialize } from 'cookie';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async function ({ request }) {
	const cookie = request.headers.get('cookie');

	const cookies = parse(cookie || '');

	console.log('SIGNING OUT');

	if (cookies.session_id && cookies.session_id.length > 0) {
		await removeSession(cookies.session_id);
	}

	const headers = new Headers();

	headers.append(
		'set-cookie',
		serialize('session_id', 'session_deleted', {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 5
		})
	);

	return {
		status: 200,
		headers
	};
};
