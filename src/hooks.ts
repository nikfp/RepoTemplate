import type { GetSession, Handle } from '@sveltejs/kit';
import { parse, serialize } from 'cookie';
import { validateAndRefreshSession } from '$lib/services/userService';

export const handle: Handle = async function ({ event, resolve }) {
	if (event.routeId === 'api/sign-out') {
		event.locals.user = undefined;
		return resolve(event);
	}

	const cookies = parse(event.request.headers.get('cookie') || '');
	console.log('LOGGING COOKIES');
	console.log(cookies);
	if (cookies.session_id) {
		const session = await validateAndRefreshSession(cookies.session_id);
		if (session) {
			event.locals.user = { email: session.userEmail };
			const response = await resolve(event);
			response.headers.append(
				'Set-Cookie',
				serialize('session_id', session.sessionId, {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: true,
					expires: session.expiryTime
				})
			);
			return response;
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
	return {
		signOut: true
	};
};
