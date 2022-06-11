/* eslint-disable */
// @ts-nocheck
import * as Types from "../../../generated-types/graphql";
import * as gm from "graphql-modules";
export namespace SendInputModule {
  interface DefinedFields {
    SendBack: 'send';
    Mutation: 'send';
  };
  
  interface DefinedInputFields {
    SendInput: 'words' | 'numbers';
  };
  
  export type SendInput = Pick<Types.SendInput, DefinedInputFields['SendInput']>;
  export type SendBack = Pick<Types.SendBack, DefinedFields['SendBack']>;
  export type Mutation = Pick<Types.Mutation, DefinedFields['Mutation']>;
  
  export type SendBackResolvers = Pick<Types.SendBackResolvers, DefinedFields['SendBack'] | '__isTypeOf'>;
  export type MutationResolvers = Pick<Types.MutationResolvers, DefinedFields['Mutation']>;
  
  export interface Resolvers {
    SendBack?: SendBackResolvers;
    Mutation?: MutationResolvers;
  };
  
  export interface MiddlewareMap {
    '*'?: {
      '*'?: gm.Middleware[];
    };
    SendBack?: {
      '*'?: gm.Middleware[];
      send?: gm.Middleware[];
    };
    Mutation?: {
      '*'?: gm.Middleware[];
      send?: gm.Middleware[];
    };
  };
}