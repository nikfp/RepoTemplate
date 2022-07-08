<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	import {houdiniClient} from '$lib/graphql-client/client'; 
	
	houdiniClient.init();

	export const load: Load = async function ({ url, session }) {
		console.log('Layout Loading');
		if (!session.user) {
			if (url.pathname !== '/sign-in' && url.pathname !== '/sign-up') {
				console.log('main page not showing session');
				return {
					status: 302,
					redirect: `/sign-in?redirect=${url.pathname}&query=${url.search}`
				};
			}
		}

		return {};
	};
</script>

<script lang="ts">
	import { session } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import SignOut from '$lib/components/SignOut.svelte';

	async function signout() {
		try {
			console.log('Sending sign out fetch');
			const response = await fetch('/api/sign-out', {
				credentials: 'include',
				method: 'POST'
			});

			const body = await response.json();

			console.log('sign out get complete');

			if (response.status === 200) {
				await invalidate('/sign-up');
				session.update((values) => {
					if (values.user) values.user = undefined;
					return values;
				});
				goto('/sign-in');
				return;
			}

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
	<br />
	<a href="/">Home</a>
	<a href="/page-a">Page A</a>
{:else}
	<a href="sign-in">Sign in here!</a> OR
	<a href="sign-up">Sign up here!</a>
{/if}

{#if $session.signOut}
	<SignOut />
{/if}
<slot />
