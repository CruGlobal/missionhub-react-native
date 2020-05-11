import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: theme.extraLightGrey,
  },
  listContent: {
    paddingBottom: 10,
  },

  header: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: 10,
    backgroundColor: theme.extraLightGrey,
  },
  title: {
    fontSize: 12,
    color: theme.textColor,
    textAlign: 'center',
  },
});
