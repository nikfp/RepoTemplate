/* eslint-disable */
// @ts-nocheck
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
  send: SendBack;
};


export type MutationSendArgs = {
  input?: InputMaybe<SendInput>;
};

export type Query = {
  __typename?: 'Query';
  greetings: Scalars['String'];
  hello: Scalars['String'];
};

export type SendBack = {
  __typename?: 'SendBack';
  send: Scalars['String'];
};

export type SendInput = {
  numbers: Scalars['Int'];
  words: Scalars['String'];
};
