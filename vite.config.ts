import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$houdini: path.resolve('.', '$houdini'),
			$graphql: path.resolve('src', 'lib', 'graphql-client')
		}
	},
	server: {
		fs: {
			allow: ['.']
		}
	},
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
};

export default config;
// export default defineConfig({
// test: {
// 	globals: true,
// 	coverage: {
// 		all: true,
// 		skipFull: true,
// 		src: ['./src'],
// 		exclude: [
// 			'**/generated/**/*',
// 			'**/graphql-client/**/*',
// 			'**/*.d.ts',
// 			'**/*.spec.ts',
// 			'**/*.svelte',
// 			'**/generated-types/**/*',
// 			'**/*/graphql-server/executor.ts'
// 		]
// 	}
// }
// });
