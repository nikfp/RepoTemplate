import 'reflect-metadata';
import { gql, testkit } from 'graphql-modules';
import { describe, expect, it } from 'vitest';
import Hello from './Hello';

describe('Hello module', async () => {
	it('works', async () => {
		const app = testkit.testModule(Hello);

		expect(app.schema.getQueryType()).toBeDefined();
	});

	it('returns proper string for hello resolver', async () => {
		const app = testkit.testModule(Hello);

		const result = await testkit.execute(app, {
			document: gql`
				{
					hello
				}
			`
		});

		expect(result).not.toBeNull();
		expect(result).not.toBeUndefined();
		if (result) {
			expect(result.data?.hello).toBeDefined();
			expect(result.data?.hello).to.equal('Hello world all over again!');
		}
	});

	it('returns proper string for greetings resolver', async () => {
		const app = testkit.testModule(Hello);

		const result = await testkit.execute(app, {
			document: gql`
				{
					greetings
				}
			`
		});

		expect(result).not.toBeUndefined();
		expect(result).not.toBeNull();
		if (result) {
			expect(result.data?.greetings).toBeDefined();
			expect(result.data?.greetings).equal('Greetings from across the pond!');
		}
	});
});
