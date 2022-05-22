<script lang="ts">
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-zod';
	import { sendInputSchema } from './validators/validators';
	import type { Input } from './validators/validators';
	import { reporter } from '@felte/reporter-svelte';
	import TextInput from './components/inputs/TextInput.svelte';
	import NumberInput from './components/inputs/NumberInput.svelte';
	import { KQL_SendIt } from './graphql-client/graphqlStores';

	const { form, errors } = createForm<Input>({
		onSubmit: async (values) => {
			const input = sendInputSchema.parse(values);
			await KQL_SendIt.mutate({ fetch, variables: { input } });
		},
		onError: (error) => {
			console.log('ERRORS');
			console.log(error);
		},
		onSuccess: (success) => {
			console.log('SUCCESS');
			console.log($KQL_SendIt.data?.send.send);
		},
		extend: [validator({ schema: sendInputSchema }), reporter]
	});
</script>

<p>
	{JSON.stringify($errors, null, 2)}
</p>
<form use:form>
	<TextInput title="Words" name="words" />
	<NumberInput title="Numbers" name="numbers" />
	<button type="submit">Submit</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		max-width: 30rem;
	}
</style>
