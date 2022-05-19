<script context="module" lang="ts">
	import { KQL_HelloThere } from '$lib/graphql-client/graphqlStores';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async function ({ fetch, session }) {
		if (!session.user) {
			console.log('main page not showing session');
			return {
				status: 302,
				redirect: '/sign-in'
			};
		}

		await KQL_HelloThere.queryLoad({ fetch });
		return {};
	};
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<br />
<br />
<br />
<a href="/api/playql" target="_blank" rel="external">Graphql Playground</a>
<br />
<br />
<br />
<h2>Server says: {$KQL_HelloThere.data?.hello}</h2>
