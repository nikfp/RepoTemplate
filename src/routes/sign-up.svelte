<script lang="ts">
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-zod';
	import { reporter } from '@felte/reporter-svelte';
	import { signupSchema as schema } from '$lib/validators/authValidators';
	import type { SignUpSchema } from '$lib/validators/authValidators';

	import TextInput from '$lib/components/inputs/TextInput.svelte';

	let formError = '';

	const { form } = createForm<SignUpSchema>({
		onSubmit: async (values) => {
			formError = '';
			const newValues = schema.parse(values);
			const response = await fetch('/api/sign-up', {
				method: 'POST',
				body: JSON.stringify(newValues),
				credentials: 'include'
			});

			const body = await response.json();

			if (response.status === 201) return body;

			const errorMessage =
				body.message || 'An error occured when the form was submitted. Please try again.';

			throw new Error(errorMessage);
		},
		onError: (error) => {
			formError = (error as Error).message;
		},
		onSuccess: (result) => {
			formError = '';
			console.log(result);
			window.location.href = '/';
		},
		extend: [validator({ schema }), reporter]
	});
</script>

<h1>Sign up</h1>
<a href="/sign-in">Sign in instead</a>

<br />
<br />

<br />
{#if formError.length > 0}
	<h3 class="error-message">{formError}</h3>
{/if}
<form use:form>
	<TextInput title="Email" name="email" />
	<TextInput title="Password" name="password" />
	<TextInput title="Confirm Password" name="confirm" />
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
