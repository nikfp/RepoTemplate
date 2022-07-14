import type { RequestHandlerArgs } from '$houdini';
import { HoudiniClient } from '$houdini';
import { session as storeSession } from '$app/stores';
import { goto, invalidate } from '$app/navigation';

async function fetchQuery({
	fetch,
	text = '',
	variables = {},
	session,
	metadata
}: RequestHandlerArgs) {
	const url = import.meta.env.VITE_GRAPHQL_ENDPOINT || '/api/graphql';

	const result = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: text,
			variables
		})
	});

	const sessionExpiry = result.headers.get('session-expiry');
	console.log(sessionExpiry);

	if (!sessionExpiry) {
		await redirectToSignIn();
		return Promise.resolve(null);
	}

	if (new Date(sessionExpiry).valueOf < Date.now().valueOf) {
		await redirectToSignIn();
		return Promise.resolve(null);
	}

	return await result.json();
}

export const houdiniClient = new HoudiniClient(fetchQuery);

async function redirectToSignIn() {
	await invalidate('/sign-in');
	storeSession.update((values) => {
		if (values.user) values.user = undefined;
		return values;
	});
	await goto('/sign-in');
}
