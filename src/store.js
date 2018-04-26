import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import getStoredStateMigrateV4 from 'redux-persist/lib/integration/getStoredStateMigrateV4';
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import jsan from 'jsan';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';

import reducers from './reducers';
import tracking from './middleware/tracking';
import steps from './middleware/steps';
import { offlineEffect } from './api/new';

const navMiddleware = createReactNavigationReduxMiddleware(
  'root',
  (state) => state.nav,
);

const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancers = composeEnhancers(
  applyMiddleware(
    thunk,
    tracking,
    steps,
    navMiddleware,
  ),
  offline({
    ...offlineConfig,
    persist: false,
    effect: offlineEffect,
  }),
);

const myTransform = createTransform(
  // transform state coming from redux on its way to being serialized and stored
  (inboundState) => {
    return jsan.stringify(inboundState);
  },
  // transform state coming from storage, on its way to be rehydrated into redux
  (outboundState) => {
    return jsan.parse(outboundState);
  },
);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  transforms: [ myTransform ],
  getStoredState: getStoredStateMigrateV4({ storage: AsyncStorage, transforms: [ myTransform ] }),
};

export const store = createStore(
  persistReducer(persistConfig, reducers),
  {},
  enhancers,
);

export const persistor = persistStore(store);

if (module.hot) {
  module.hot.accept(() => {
    // This fetches the new state of the above reducers.
    const nextRootReducer = require('./reducers').default;
    store.replaceReducer(
      persistReducer(persistConfig, nextRootReducer)
    );
  });
}

