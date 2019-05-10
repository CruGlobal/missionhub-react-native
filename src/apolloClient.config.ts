import { AsyncStorage } from 'react-native';
import ApolloClient from 'apollo-boost';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types';

import { BASE_URL } from './api/utils';
import { store } from './store';

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: AsyncStorage as PersistentStorage<
    PersistedData<NormalizedCacheObject>
  >,
});

export const apolloClient = new ApolloClient({
  uri: `${BASE_URL}/apis/graphql`,
  cache,
  request: operation => {
    operation.setContext({
      headers: { authorization: `Bearer ${store.getState().auth.token}` },
    });
    return Promise.resolve();
  },
});
