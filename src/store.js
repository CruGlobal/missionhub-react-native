import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';

import reducers from './reducers';

let myCreateStore = createStore;

// Setup reactotron for development builds
if (__DEV__) {
  const Reactotron = require('reactotron-react-native').default;
  myCreateStore = Reactotron.createStore;
}

// Setup enhancers and middleware
const enhancers = [];
const middleware = [thunk];

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

export default function getStore(onCompletion) {
  const store = myCreateStore(
    reducers,
    {},
    composedEnhancers,
  );
  persistStore(store, { storage: AsyncStorage }, () => {
    onCompletion(store);
    // setTimeout(() => onCompletion(store), 1500);
  });

  return store;
}
