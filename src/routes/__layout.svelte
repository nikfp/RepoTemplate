<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async function ({ url, session }) {
		console.log(url.pathname);
		if (!session.user) {
			if (url.pathname !== '/sign-in' && url.pathname !== '/sign-up') {
				console.log('main page not showing session');
				return {
					status: 302,
					redirect: '/sign-in'
				};
			}
		}

		return {};
	};
</script>

<script lang="ts">
	import { session } from '$app/stores';

	async function signout() {
		try {
			const response = await fetch('/api/sign-out', {
				credentials: 'include',
				method: 'GET'
			});

			if (response.status === 200) {
				window.location.href = '/sign-in';
				return;
			}

			const body = await response.json();
			const message = body.message || 'An error occured while signing out';

			throw new Error(message);
		} catch (error) {
			console.log((error as Error).message);
			window.location.href = '/';
		}
	}

	$: userExists = $session.user ? true : false;
</script>

{#if userExists}
	<p>Hello, {$session.user?.email}</p>
	<button on:click={signout}>Sign out</button>
{:else}
	<a href="sign-in">Sign in here!</a> OR
	<a href="sign-up">Sign up here!</a>
{/if}
<slot />
