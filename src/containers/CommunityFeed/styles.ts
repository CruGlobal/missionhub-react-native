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
    alignContent: 'center',
    paddingVertical: 10,
    marginLeft: 15,
    backgroundColor: theme.extraLightGrey,
  },
  title: {
    fontSize: 24,
    fontWeight: '200',
    color: theme.grey,
  },
});
