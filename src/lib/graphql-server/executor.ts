import { useErrorHandler, envelop } from '@envelop/core';
import { useGraphQLModules } from '@envelop/graphql-modules';
import { useGraphQlJit } from '@envelop/graphql-jit';
import { createApplication } from 'graphql-modules';
import Hello from './modules/Hello/Hello';
import SendInput from './modules/SendInput/SendInput';

const graphqlApplication = createApplication({
	modules: [Hello, SendInput]
});

const schema = graphqlApplication.schema;

const graphqlExecutor = envelop({
	plugins: [
		useGraphQLModules(graphqlApplication),
		useGraphQlJit(),
		useErrorHandler((errors) => {
			console.error('useErrorHandler', JSON.stringify(errors, null, 2));
		})
	]
});

export { graphqlApplication, graphqlExecutor, schema };
