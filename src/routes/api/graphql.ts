import type { RequestEvent } from '@sveltejs/kit/types/internal';
import { graphqlExecutor } from '../../lib/graphql-server/executor';

export async function get() {
	return {
		status: 302,
		headers: { Location: '/' }
	};
}

export async function post(event: RequestEvent) {
	if (!event.locals.user) {
		return {
			status: 401,
			body: {
				message: 'Unauthorized'
			}
		};
	}
	const {
		// Get the GraphQL execution functions with attached plugin handlers
		parse,
		validate,
		contextFactory,
		execute,
		schema
		// pass in an initial context that all plugins can consume and extend
	} = graphqlExecutor({ req: event.request });

	const { query, variables } = await event.request.json();

	const document = parse(query);
	const validationErrors = validate(schema, document);

	if (validationErrors.length > 0) {
		return {
			status: 200,
			body: { errors: validationErrors }
		};
	}

	// Build the context and execute
	const contextValue = await contextFactory();
	const result = await execute({
		document,
		schema,
		variableValues: variables,
		contextValue
	});

	return {
		status: 200,
		body: result
	};
}
