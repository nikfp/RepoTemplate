<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async function ({ fetch }) {
		const response = await fetch('/api/sign-out', {
			method: 'GET',
			credentials: 'include'
		});

		return {
			status: 309,
			redirect: '/',
		};
	};
</script>
