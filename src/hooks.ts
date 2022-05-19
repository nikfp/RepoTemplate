import type { GetSession, Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import { getSession as dbSession } from './routes/api/_db.js';

export const handle: Handle = async function ({ event, resolve }) {
	const cookies = parse(event.request.headers.get('cookie') || '');
	console.warn(
		'WARNING - Please set project up for proper password hashing and salting. DO NOT CONTINUE TO PRODUCTION WITH INITIAL SETUP!'
	);
	if (cookies.session_id) {
		const session = await dbSession(cookies.session_id);
		if (session) {
			event.locals.user = { email: session.email };
			return resolve(event);
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
