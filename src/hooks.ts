import type { GetSession, Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import { getSession as dbSession, getUserById } from '$lib/services/userService';

export const handle: Handle = async function ({ event, resolve }) {
	const cookies = parse(event.request.headers.get('cookie') || '');
	console.log('LOGGING COOKIES');
	console.log(cookies);
	if (cookies.session_id) {
		const session = await dbSession(cookies.session_id);
		if (session) {
			const user = await getUserById(session.userId);
			if (user) {
				event.locals.user = { email: user.email };
				return resolve(event);
			}
		}
	}

	event.locals.user = undefined;
	return resolve(event);
};

export const getSession: GetSession = async function (event) {
	if (event.locals?.user) {
		return {
			user: {
				email: event.locals.user.email
			}
		};
	}
	return {};
};
