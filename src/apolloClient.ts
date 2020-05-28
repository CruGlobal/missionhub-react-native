import { AsyncStorage } from 'react-native';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import {
  InMemoryCache,
  NormalizedCacheObject,
  IntrospectionFragmentMatcher,
  IntrospectionResultData,
} from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types';

import introspectionQueryResultData from '../schema.json';

import { BASE_URL } from './api/utils';
import { store } from './store';
import { UPDATE_TOKEN } from './constants';
import { rollbar } from './utils/rollbar.config';
import { typeDefs, resolvers, initializeLocalState } from './apolloLocalState';

export let apolloClient: ApolloClient<NormalizedCacheObject>;

export const createApolloClient = async () => {
  const rollbarLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(error => {
        const errorMessage = `[Apollo GraphQL error]: ${error.message}`;
        rollbar.error(errorMessage, error);
        // eslint-disable-next-line no-console
        console.log(errorMessage, error);
      });
    }
    if (networkError) {
      const errorMessage = `[Apollo Network error]: ${networkError.message}`;
      rollbar.error(errorMessage, networkError);
      // eslint-disable-next-line no-console
      console.log(errorMessage, networkError);
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

  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: introspectionQueryResultData as IntrospectionResultData,
  });

  const cache = new InMemoryCache({ fragmentMatcher });

  await persistCache({
    cache,
    storage: AsyncStorage as PersistentStorage<
      PersistedData<NormalizedCacheObject>
    >,
  });

  apolloClient = new ApolloClient({
    link,
    cache,
    typeDefs,
    resolvers,
    assumeImmutableResults: true,
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

  initializeLocalState(apolloClient);
  apolloClient.onClearStore(() =>
    Promise.resolve(apolloClient && initializeLocalState(apolloClient)),
  );

  return apolloClient;
};
