import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-boost';
import { SchemaLink } from 'apollo-link-schema';
import { addMockFunctionsToSchema, IMocks } from 'graphql-tools';
import { buildClientSchema, IntrospectionQuery } from 'graphql/utilities';

import schemaFile from '../../schema.json';

import { globalMocks } from './globalMocks';

export const createApolloMockClient = (mockResolvers: IMocks = {}) => {
  const schema = buildClientSchema(
    (schemaFile as unknown) as IntrospectionQuery,
  );

  addMockFunctionsToSchema({
    schema,
    mocks: { ...globalMocks, ...mockResolvers },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new SchemaLink({ schema }),
  });
};
