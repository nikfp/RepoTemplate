<script lang="ts">
	import { createForm } from 'felte';

	interface FormFields {
		testing: string;
		testnumber: number;
	}

	const { form } = createForm<FormFields>({
		onSubmit: (values) => {
			console.log(values);
		}
	});

	let email = '';
	let password = '';
	let errorMessage = '';

	async function submit() {
		errorMessage = '';
		const response = await fetch('/api/sign-in', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({ email, password })
		});
		if (response.status === 200) {
			console.log('hit status block');
			window.location.href = '/';
			return;
		}

		const body = await response.json();
		errorMessage =
			body.message || 'An error occured when the form was submitted. Please try again.';
	}
</script>

<h1>Sign In form</h1>
<a href="/sign-up">Sign up instead</a>

<br />
<br />
<br />
{#if errorMessage.length > 0}
	<h3 class="error-message">{errorMessage}</h3>
{/if}
<form on:submit|preventDefault={submit}>
	<label for="email">Email</label>
	<input type="text" name="email" id="email" bind:value={email} />
	<label for="password">Password</label>
	<input type="text" name="password" id="password" bind:value={password} />
	<button type="button" on:click={submit}>Submit</button>
</form>

<br />
<br />
<br />
<form use:form>
	<label for="testing">Testing</label>
	<input type="text" name="testing" id="testing" />
	<label for="testnumber">Test Number </label>
	<input type="number" name="testnumber" id="testnumber" />
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
