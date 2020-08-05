import 'core-js';
import { LogBox, AppRegistry } from 'react-native';

import App from './src/App';

LogBox.ignoreLogs([
  'currentlyFocusedField is deprecated', // node_modules/@react-navigation/native/lib/module/createKeyboardAwareNavigator.js#44 is throwing this. Needs a react-navigation upgrade of some sort
]);

AppRegistry.registerComponent('MissionHub', () => App);
