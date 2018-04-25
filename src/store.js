import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, createTransform } from 'redux-persist';
import jsan from 'jsan';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';

import reducers from './reducers';
import tracking from './middleware/tracking';
import steps from './middleware/steps';
import rehydrateNavigation from './middleware/rehydrateNavigation';

let myCreateStore = createStore;

const navMiddleware = createReactNavigationReduxMiddleware(
  'root',
  (state) => state.nav,
);

// Setup enhancers and middleware
const enhancers = [];
const middleware = [ thunk, rehydrateNavigation, tracking, steps, navMiddleware ];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

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

export default function getStore(onCompletion) {
  const store = myCreateStore(
    reducers,
    {},
    storeEnhancers,
  );
  persistStore(store, { storage: AsyncStorage, transforms: [ myTransform ] }, () => {
    onCompletion(store);
    // setTimeout(() => onCompletion(store), 1500);
  });

  return store;
}
