/* global __DEV__ */
if (__DEV__) {
  const Reactotron = require('reactotron-react-native').default;
  const trackGlobalErrors = require('reactotron-react-native').trackGlobalErrors;
  const openInEditor = require('reactotron-react-native').openInEditor;
  const overlay = require('reactotron-react-native').overlay;
  // const asyncStorage = require('reactotron-react-native').asyncStorage;
  const networking = require('reactotron-react-native').networking;
  const { reactotronRedux } = require('reactotron-redux');

  Reactotron
    .configure({
      name: 'Mission Hub App',
    })
    .use(reactotronRedux({
      isActionImportant: (action) => action.type && action.type.indexOf('_SUCCESS') >= 0,
    }))
    .use(trackGlobalErrors())
    .use(openInEditor())
    .use(overlay())
    // .use(asyncStorage())
    .use(networking())
    // .useReactNative() // Use ALL RN plugins
    .connect();
  Reactotron.clear();

  // Apply this to the global console value
  console.tron = Reactotron;
}
