import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  row: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: theme.fullWidth,
    marginTop: 1,
  },
  name: {
    fontSize: 13,
    color: theme.darkText,
  },
  unassigned: {
    fontSize: 13,
    color: theme.red,
  },
});
