<script lang="ts">
	let email = '';
	let password = '';
	let confirmPassword = '';
	let errorMessage = '';

	$: passwordMatched = password === confirmPassword;

	async function submit() {
		errorMessage = '';
		if (!passwordMatched) {
			errorMessage = 'Passwords must match!';
			return;
		}
		const response = await fetch('/api/sign-up', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({ email, password })
		});

		if (response.status === 201) {
			console.log('hit styatus block');
			window.location.href = '/';
			return;
		}

		const body = await response.json();
		errorMessage =
			body.message || 'An error occured when the form was submitted. Please try again.';
	}
</script>

<h1>Sign up form</h1>
<a href="/sign-in">Sign in instead</a>

<br />
<br />

<br />
{#if errorMessage.length > 0}
	<h3 class="error-message">{errorMessage}</h3>
{/if}
<form on:submit|preventDefault={submit}>
	<label for="email">email</label>
	<input type="text" name="email" id="email" bind:value={email} />
	<label for="password">Password</label>
	<input type="text" name="password" id="password" bind:value={password} />
	<label for="confirm-password">Confirm Password</label>
	<input type="text" name="confirm-password" id="confirm-passowrd" bind:value={confirmPassword} />
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
