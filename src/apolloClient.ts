import { AsyncStorage } from 'react-native';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
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
import { EXPIRED_ACCESS_TOKEN, INVALID_ACCESS_TOKEN } from './constants';
import { rollbar } from './utils/rollbar.config';
import { typeDefs, resolvers, initializeLocalState } from './apolloLocalState';
import { getCachedAuthToken, setAuthToken } from './auth/authStore';
import { authRefresh } from './auth/provideAuthRefresh';

export let apolloClient: ApolloClient<NormalizedCacheObject>;

export const createApolloClient = async () => {
  const rollbarLink = onError(
    ({ graphQLErrors, networkError, forward, operation }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(error => {
          if (
            graphQLErrors.some(
              ({ message }) =>
                message === EXPIRED_ACCESS_TOKEN ||
                message === INVALID_ACCESS_TOKEN,
            )
          ) {
            (async () => {
              const retry = await authRefresh();
              retry && forward(operation);
            })();
          } else {
            const errorMessage = `[Apollo GraphQL error]: ${error.message}`;
            rollbar.error(errorMessage, error);
            // eslint-disable-next-line no-console
            console.log(errorMessage, error);
          }
        });
      }
      if (networkError) {
        const errorMessage = `[Apollo Network error]: ${networkError.message}`;
        rollbar.error(errorMessage, networkError);
        // eslint-disable-next-line no-console
        console.log(errorMessage, networkError);
      }
    },
  );

  const authLink = new ApolloLink((operation, forward) => {
    const authToken = getCachedAuthToken();
    if (authToken && !operation.getContext().public) {
      operation.setContext({
        headers: { authorization: `Bearer ${authToken}` },
      });
    }
    return forward(operation).map(data => {
      const sessionHeader = operation
        .getContext()
        .response.headers.get('X-MH-Session');

      sessionHeader && setAuthToken(sessionHeader);
      return data;
    });
  });

  const uploadLink = createUploadLink({
    uri: `${BASE_URL}/apis/graphql`,
    credentials: 'same-origin',
  });

  const link = ApolloLink.from([
    rollbarLink,
    authLink,
    (uploadLink as unknown) as ApolloLink,
  ]);

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
