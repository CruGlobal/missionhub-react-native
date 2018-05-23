import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.secondaryColor,
  },
  gif: {
    flex: 1,
    width: theme.fullWidth,
    height: theme.fullHeight,
  },
});
