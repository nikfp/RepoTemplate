import { gql, createModule } from 'graphql-modules';
import type { HelloModule } from './generated/module-types';

const typeDefs = gql`
	type Query {
		hello: String!
		greetings: String!
	}
`;

const resolvers: HelloModule.Resolvers = {
	Query: {
		hello: () => 'Hello world all over again!',
		greetings: () => 'Greetings from across the pond!'
	}
};

export default createModule({
	id: 'Hello',
	typeDefs,
	resolvers
});
