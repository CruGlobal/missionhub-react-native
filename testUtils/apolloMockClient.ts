import { ApolloClient } from 'apollo-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
  IntrospectionResultData,
} from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import { addMockFunctionsToSchema, IMocks } from 'graphql-tools';
import { DocumentNode } from 'graphql';
import { buildClientSchema, IntrospectionQuery } from 'graphql/utilities';
import gql from 'fraql';
import { createMockerFromIntrospection } from 'fraql/mock';

import introspectionQuery from '../schema.json';
import {
  typeDefs,
  resolvers,
  initializeLocalState,
} from '../src/apolloLocalState';

import { globalMocks } from './globalMocks';

export const createApolloMockClient = (
  mocks: IMocks = {},
  initialApolloState?: unknown,
) => {
  const schema = buildClientSchema(
    (introspectionQuery as unknown) as IntrospectionQuery,
  );

  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: introspectionQuery as IntrospectionResultData,
  });

  addMockFunctionsToSchema({
    schema,
    mocks: { ...globalMocks, ...mocks },
  });

  const apolloClient = new ApolloClient({
    cache: new InMemoryCache({ fragmentMatcher }),
    link: new SchemaLink({ schema }),
    typeDefs,
    resolvers,
  });

  initializeLocalState(apolloClient);
  initialApolloState && apolloClient.writeData({ data: initialApolloState });
  apolloClient.onClearStore(() =>
    Promise.resolve(initializeLocalState(apolloClient)),
  );

  return apolloClient;
};

export const mockFragment = <TData>(
  fragmentDocument: DocumentNode,
  options?: {
    mocks: IMocks;
  },
): TData => {
  if (!fragmentDocument.loc) {
    throw 'Unable to get original gql query to create FraQL fragment.';
  }

  return createMockerFromIntrospection(introspectionQuery, {
    mocks: globalMocks,
  }).mockFragment(gql(fragmentDocument.loc.source.body), options);
};
