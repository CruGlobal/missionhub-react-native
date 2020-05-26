import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { FieldNode } from 'graphql';
import { FragmentMap } from 'apollo-utilities';

import { ViewedStateQuery } from './__generated__/ViewedStateQuery';

export const typeDefs = gql`
  extend type Query {
    viewedState: ViewedState!
  }
  type ViewedState {
    stepExplainerModal: Boolean!
  }
  extend type Mutation {
    viewedStepExplainerModal: ViewedState!
  }
  extend type Post {
    feedItem: FeedItem!
  }
`;

const VIEWED_STATE_QUERY = gql`
  query ViewedStateQuery {
    viewedState @client {
      stepExplainerModal
    }
  }
`;

type Resolver = (
  rootValue: unknown,
  args: unknown,
  // Partial context. More can be added https://www.apollographql.com/docs/react/data/local-state/#local-resolvers
  context: { client: ApolloClient<NormalizedCacheObject> },
  info?: {
    field: FieldNode;
    fragmentMap: FragmentMap;
  },
) => unknown;
// Resolvers from node_modules/apollo-client/core/types.d.ts has a lot of any types on the resolver functions
export interface Resolvers {
  [key: string]: {
    [field: string]: Resolver;
  };
}

export const resolvers: Resolvers = {
  Mutation: {
    viewedStepExplainerModal: (_, _args, { client }) => {
      const data = client.readQuery<ViewedStateQuery>({
        query: VIEWED_STATE_QUERY,
      });
      const newViewedState = {
        ...(data as NonNullable<typeof data>).viewedState,
        stepExplainerModal: true,
      };

      client.writeQuery<ViewedStateQuery>({
        query: VIEWED_STATE_QUERY,
        data: {
          viewedState: newViewedState,
        },
      });
      return newViewedState;
    },
  },
};

export const initializeLocalState = (
  client: ApolloClient<NormalizedCacheObject>,
) => {
  try {
    client.readQuery<ViewedStateQuery>({
      query: VIEWED_STATE_QUERY,
    });
  } catch {
    client.writeQuery<ViewedStateQuery>({
      query: VIEWED_STATE_QUERY,
      data: {
        viewedState: { __typename: 'ViewedState', stepExplainerModal: false },
      },
    });
  }
};
