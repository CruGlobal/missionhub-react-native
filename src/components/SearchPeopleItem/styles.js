import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  row: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: theme.white,
    width: theme.fullWidth,
    borderBottomWidth: theme.separatorHeight,
    borderBottomColor: theme.separatorColor,
  },
  name: {
    fontSize: 14,
    color: theme.primaryColor,
  },
  organization: {
    fontSize: 10,
  },
});
