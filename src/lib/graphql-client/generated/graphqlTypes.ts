/* eslint-disable */
import gql from 'graphql-tag';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: 'Mutation';
  send: Scalars['String'];
};


export type MutationSendArgs = {
  input?: InputMaybe<SendInput>;
};

export type Query = {
  __typename?: 'Query';
  greetings: Scalars['String'];
  hello: Scalars['String'];
};

export type SendInput = {
  numbers: Scalars['Int'];
  words: Scalars['String'];
};

export type HelloThereQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloThereQuery = { __typename?: 'Query', hello: string };


export const HelloThere = gql`
    query HelloThere {
  hello
}
    `;

export const HelloThereDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HelloThere"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hello"}}]}}]} as unknown as DocumentNode<HelloThereQuery, HelloThereQueryVariables>;