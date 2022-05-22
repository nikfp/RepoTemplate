import { gql, createModule } from 'graphql-modules';
import type { SendInputModule } from './generated/module-types';

const typeDefs = gql`
	input SendInput {
		words: String!
		numbers: Int!
	}

	type SendBack {
		send: String!
	}

	type Mutation {
		send(input: SendInput): SendBack!
	}
`;

const resolvers: SendInputModule.Resolvers = {
	Mutation: {
		send: (_parent, args) => {
			console.log(args);
			return {
				send: `The words were ${args.input?.words} and the number is ${args.input?.numbers}`
			};
		}
	}
};

export default createModule({
	id: 'SendInput',
	typeDefs,
	resolvers
});
