import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },
  list: {
    backgroundColor: theme.transparent,
    borderBottomColor: theme.separatorColor,
    borderBottomWidth: theme.separatorHeight,
  },
  gif: {
    flex: 1,
    width: theme.fullWidth,
  },
  loadText: {
    fontSize: 64,
    color: theme.primaryColor,
    paddingVertical: 0,
  },
});
