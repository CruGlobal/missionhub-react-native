import { AsyncStorage } from 'react-native';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types';

import { BASE_URL } from './api/utils';
import { store } from './store';
import { UPDATE_TOKEN } from './constants';
import { rollbar } from './utils/rollbar.config';

const rollbarLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(error =>
      rollbar.error(`[Apollo GraphQL error]: ${error.message}`, error),
    );
  }
  if (networkError) {
    rollbar.error(
      `[Apollo Network error]: ${networkError.message}`,
      networkError,
    );
  }
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: { authorization: `Bearer ${store.getState().auth.token}` },
  });
  return (
    (forward &&
      forward(operation).map(data => {
        const sessionHeader = operation
          .getContext()
          .response.headers.get('X-MH-Session');

        sessionHeader &&
          store.dispatch({
            type: UPDATE_TOKEN,
            token: sessionHeader,
          });
        return data;
      })) ||
    null
  );
});

const httpLink = new HttpLink({
  uri: `${BASE_URL}/apis/graphql`,
  credentials: 'same-origin',
});

const link = ApolloLink.from([rollbarLink, authLink, httpLink]);

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: AsyncStorage as PersistentStorage<
    PersistedData<NormalizedCacheObject>
  >,
});

export const apolloClient = new ApolloClient({
  link,
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'network-only',
    },
  },
});
