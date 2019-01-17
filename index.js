import 'core-js';
import { YellowBox, AppRegistry } from 'react-native';

import App from './src/App';

// See https://github.com/react-navigation/react-navigation/issues/3956
YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
  'Class RCTCxxModule',
  'Remote debugger',
]);

AppRegistry.registerComponent('MissionHub', () => App);
