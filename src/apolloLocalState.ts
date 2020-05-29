import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { FieldNode } from 'graphql';
import { FragmentMap } from 'apollo-utilities';

import { ViewedStateQuery } from './__generated__/ViewedStateQuery';
import { NotificationStateQuery } from './__generated__/NotificationStateQuery';

export const typeDefs = gql`
  extend type Query {
    viewedState: ViewedState!
    notificationState: NotificationState!
  }
  type ViewedState {
    stepExplainerModal: Boolean!
  }

  type NotificationState {
    hasUnreadNotifications: Boolean!
    latestNotification: String!
  }
  extend type Mutation {
    viewedStepExplainerModal: ViewedState!
    updateLatestNotification(latestNotification: String!): NotificationState!
    updateHasUnreadNotifications: NotificationState!
  }
`;

const VIEWED_STATE_QUERY = gql`
  query ViewedStateQuery {
    viewedState @client {
      stepExplainerModal
    }
  }
`;

const NOTIFICATION_STATE_QUERY = gql`
  query NotificationStateQuery {
    notificationState @client {
      hasUnreadNotifications
      latestNotification
    }
  }
`;

type Resolver = (
  rootValue: unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: unknown | any,
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
    updateLatestNotification: (_, { latestNotification }, { client }) => {
      const data = client.readQuery<NotificationStateQuery>({
        query: NOTIFICATION_STATE_QUERY,
      });

      const newNotificationState = {
        ...(data as NonNullable<typeof data>).notificationState,
        latestNotification,
        hasUnreadNotifications: true,
      };

      client.writeQuery<NotificationStateQuery>({
        query: NOTIFICATION_STATE_QUERY,
        data: {
          notificationState: newNotificationState,
        },
      });
      return newNotificationState;
    },
    updateHasUnreadNotifications: (_, _args, { client }) => {
      const data = client.readQuery<NotificationStateQuery>({
        query: NOTIFICATION_STATE_QUERY,
      });

      const newNotificationState = {
        ...(data as NonNullable<typeof data>).notificationState,
        hasUnreadNotifications: false,
      };

      client.writeQuery<NotificationStateQuery>({
        query: NOTIFICATION_STATE_QUERY,
        data: {
          notificationState: newNotificationState,
        },
      });

      return newNotificationState;
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
    client.readQuery<NotificationStateQuery>({
      query: NOTIFICATION_STATE_QUERY,
    });
  } catch {
    client.writeQuery<ViewedStateQuery>({
      query: VIEWED_STATE_QUERY,
      data: {
        viewedState: { __typename: 'ViewedState', stepExplainerModal: false },
      },
    });
    client.writeQuery<NotificationStateQuery>({
      query: NOTIFICATION_STATE_QUERY,
      data: {
        notificationState: {
          __typename: 'NotificationState',
          hasUnreadNotifications: false,
          latestNotification: '',
        },
      },
    });
  }
};
