<script lang="ts">
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-zod';
	import { reporter } from '@felte/reporter-svelte';
	import { signinSchema as schema } from '../lib/validators/authValidators';
	import type { SignInSchema } from '../lib/validators/authValidators';
	import TextInput from '../lib/components/inputs/TextInput.svelte';
	import { page } from '$app/stores';
import { onMount } from 'svelte';

	const redirectUrl = $page.url.searchParams.get('redirect') ?? '/';
	const query = $page.url.searchParams.get('query') ?? '';
	console.log(redirectUrl);
	console.log(query);

	let formError = '';

	const { form } = createForm<SignInSchema>({
		onSubmit: async (values) => {
			formError = '';

			const response = await fetch('/api/sign-in', {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify(schema.parse(values))
			});
			const body = await response.json();

			if (response.status === 200) {
				return body;
			}

			const errorMessage =
				body.message || 'An error occured when the form was submitted. Please try again.';

			throw new Error(errorMessage);
		},
		onError: (errors) => {
			formError = (errors as Error).message;
		},
		onSuccess: async (response) => {
			formError = '';
			console.log(response);
			window.location.href = redirectUrl + query;
		},
		extend: [validator({ schema }), reporter]
	});
</script>

<h1>Sign In form</h1>
<a href="/sign-up">Sign up instead</a>

<br />
<br />
<br />
{#if formError.length > 0}
	<p class="error-message">{formError}</p>
{/if}
<form use:form>
	<TextInput title="Email" name="email" />
	<TextInput title="Password" name="password" />
	<button type="submit">Submit</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		max-width: 30rem;
	}

	.error-message {
		color: red;
	}
</style>
