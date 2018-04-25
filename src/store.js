import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import getStoredStateMigrateV4 from 'redux-persist/lib/integration/getStoredStateMigrateV4';
import jsan from 'jsan';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';

import reducers from './reducers';
import tracking from './middleware/tracking';
import steps from './middleware/steps';

let myCreateStore = createStore;


const navMiddleware = createReactNavigationReduxMiddleware(
  'root',
  (state) => state.nav,
);

// Setup enhancers and middleware
const enhancers = [];
const middleware = [ thunk, tracking, steps, navMiddleware ];

const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const storeEnhancers = composeEnhancers(
  applyMiddleware(...middleware),
  ...enhancers
);

let myTransform = createTransform(
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

export default () => {
  const store = myCreateStore(
    persistReducer(persistConfig, reducers),
    {},
    storeEnhancers,
  );
  const persistor = persistStore(store);

  if (module.hot) {
    module.hot.accept(() => {
      // This fetches the new state of the above reducers.
      const nextRootReducer = require('./reducers').default;
      store.replaceReducer(
        persistReducer(persistConfig, nextRootReducer)
      );
    });
  }

  return { store, persistor };
};
