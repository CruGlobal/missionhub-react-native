import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import {
  persistStore,
  persistReducer,
  createTransform,
  createMigrate,
} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import getStoredStateMigrateV4 from 'redux-persist/lib/integration/getStoredStateMigrateV4';
import jsan from 'jsan';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';

import reducers from './reducers';
import tracking from './middleware/tracking';
import { migrations } from './storeMigrations';

const navMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav,
);

// Setup enhancers and middleware
const enhancers = [];
const middleware = [thunk, tracking, navMiddleware];

const composeEnhancers =
  (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const storeEnhancers = composeEnhancers(
  applyMiddleware(...middleware),
  ...enhancers,
);

const myTransform = createTransform(
  // transform state coming from redux on its way to being serialized and stored
  inboundState => {
    return jsan.stringify(inboundState);
  },
  // transform state coming from storage, on its way to be rehydrated into redux
  outboundState => {
    return jsan.parse(outboundState);
  },
);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  transforms: [myTransform],
  getStoredState: getStoredStateMigrateV4({
    storage: AsyncStorage,
    transforms: [myTransform],
  }),
  blacklist: ['tabs'],
  version: Math.max(...Object.keys(migrations)),
  migrate: createMigrate(migrations),
};

export const store = createStore(
  persistReducer(persistConfig, reducers),
  {},
  storeEnhancers,
);

export const persistor = persistStore(store);

if (module.hot) {
  module.hot.accept(() => {
    // This fetches the new state of the above reducers.
    const nextRootReducer = require('./reducers').default;
    store.replaceReducer(persistReducer(persistConfig, nextRootReducer));
  });
}
