import { ApolloClient } from 'apollo-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import { addMockFunctionsToSchema, IMocks } from 'graphql-tools';
import { DocumentNode } from 'graphql';
import { buildClientSchema, IntrospectionQuery } from 'graphql/utilities';
import gql from 'fraql';
import { createMockerFromIntrospection } from 'fraql/mock';

import introspectionQuery from '../schema.json';

import { globalMocks } from './globalMocks';

export const createApolloMockClient = (mocks: IMocks = {}) => {
  const schema = buildClientSchema(
    (introspectionQuery as unknown) as IntrospectionQuery,
  );

  const fragmentMatcher = new IntrospectionFragmentMatcher({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    introspectionQueryResultData: introspectionQuery as any,
  });

  addMockFunctionsToSchema({
    schema,
    mocks: { ...globalMocks, ...mocks },
  });

  return new ApolloClient({
    cache: new InMemoryCache({ fragmentMatcher }),
    link: new SchemaLink({ schema }),
  });
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
