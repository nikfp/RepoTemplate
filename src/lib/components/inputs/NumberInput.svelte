<script lang="ts">
	import { ValidationMessage } from '@felte/reporter-svelte';

	export let className = '';
	export let name: string;
	export let title: string;

	$: componentClass = 'input ' + className;
</script>

<div class={componentClass}>
	<label for={name}>{title}</label>
	<input type="number" {name} id={name} />
	<ValidationMessage for={name} let:messages={message}>
		{#if message}
			<span class="error-message">{message}</span>
		{/if}
	</ValidationMessage>
</div>

<style>
	.input {
		display: flex;
		flex-direction: column;
	}

	.input:not(:first-of-type) {
		padding-top: 0.5rem;
	}

	.input:last-of-type {
		padding-bottom: 0.5rem;
	}

	.error-message {
		color: red;
	}
</style>
