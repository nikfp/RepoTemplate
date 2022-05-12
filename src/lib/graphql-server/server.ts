import { useErrorHandler, envelop } from '@envelop/core';
import { useGraphQLModules } from '@envelop/graphql-modules';
import { useGraphQlJit } from '@envelop/graphql-jit';
import { createApplication } from 'graphql-modules';
import Hello from './modules/Hello/Hello';

const graphqlApplication = createApplication({
	modules: [Hello]
});

const schema = graphqlApplication.schema;

const graphqlServer = envelop({
	plugins: [
		useGraphQLModules(graphqlApplication),
		useGraphQlJit(),
		useErrorHandler((errors, _args) => {
			console.error('useErrorHandler', JSON.stringify(errors, null, 2));
		})
	]
});

export { graphqlApplication, graphqlServer, schema };
