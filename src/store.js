import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, createTransform } from 'redux-persist';
import jsan from 'jsan';

import reducers from './reducers';
import tracking from './middleware/tracking';

let myCreateStore = createStore;

// Setup reactotron for development builds
if (__DEV__) {
  const Reactotron = require('reactotron-react-native').default;
  myCreateStore = Reactotron.createStore;
}

// Setup enhancers and middleware
const enhancers = [];
const middleware = [ thunk, tracking ];

const composedEnhancers = compose(
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
    composedEnhancers,
  );
  persistStore(store, { storage: AsyncStorage, transforms: [ myTransform ] }, () => {
    onCompletion(store);
    // setTimeout(() => onCompletion(store), 1500);
  });

  return store;
}
