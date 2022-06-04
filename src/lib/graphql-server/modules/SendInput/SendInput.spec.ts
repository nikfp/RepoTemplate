import 'reflect-metadata';
import { gql, testkit } from 'graphql-modules';
import { describe, expect, it } from 'vitest';
import SendInput from './SendInput';
import Hello from '../Hello/Hello';

describe('SendInput', async () => {
	it('works', async () => {
		const app = testkit.testModule(SendInput);

		expect(app.schema.getMutationType()).toBeDefined();
	});

	const words = 'hello there';
	const numbers = 7;

	it('returns proper string', async () => {
		const app = testkit.testModule(SendInput, {
			inheritTypeDefs: [Hello],
			modules: [Hello]
		});

		const result = await testkit.execute(app, {
			document: gql`
				mutation SendIt($input: SendInput!) {
					send(input: $input) {
						send
					}
				}
			`,
			variableValues: {
				input: {
					words,
					numbers
				}
			}
		});

		expect(result.data).toBeDefined();
		expect(result.data).not.toBeNull();
		if (result) {
			expect(result.data?.send.send).to.equal(
				`The words were ${words} and the number is ${numbers}`
			);
		}
	});

	it('throws error when no variables passed', async () => {
		const app = testkit.testModule(SendInput, {
			inheritTypeDefs: [Hello],
			modules: [Hello]
		});

		const result = await testkit.execute(app, {
			document: gql`
				mutation SendIt($input: SendInput!) {
					send(input: $input) {
						send
					}
				}
			`,
			variableValues: {
				input: null
			}
		});

		expect(result).toBeDefined();
		expect(result.data).toBeUndefined();
		expect(result.errors).toBeDefined();
	});
});
