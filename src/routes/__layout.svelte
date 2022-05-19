<script lang="ts">
	import { session } from '$app/stores';

	async function signout() {
		const response = await fetch('/sign-out', {
			credentials: 'include',
			method: 'GET'
		});

		window.location.href = '/sign-in';
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
