import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		coverage: {
			all: true,
			skipFull: true,
			src: ['./src'],
			exclude: [
				'**/generated/**/*',
				'**/graphql-client/**/*',
				'**/*.d.ts',
				'**/*.spec.ts',
				'**/*.svelte',
				'**/generated-types/**/*',
				'**/*/graphql-server/executor.ts'
			]
		}
	}
});
