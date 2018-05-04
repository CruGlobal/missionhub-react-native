import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.black,
    position: 'absolute',
    width: theme.fullWidth,
    height: theme.fullHeight,
    opacity: .7,
  },
  gif: {
    flex: 1,
    width: 60,
  },
});