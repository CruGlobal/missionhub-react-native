import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  gif: {
    flex: 1,
    width: theme.fullWidth,
  },
  loadText: {
    ...theme.textAmatic48,
    fontSize: 64,
    color: theme.primaryColor,
  },
});
