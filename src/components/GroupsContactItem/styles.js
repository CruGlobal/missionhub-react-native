import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  row: {
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 13,
    backgroundColor: theme.white,
    borderBottomColor: theme.separatorColor,
    borderBottomWidth: theme.separatorHeight,
    marginBottom: 15,
  },
  rowContent: {
    paddingLeft: 15,
    borderLeftColor: theme.separatorColor,
    borderLeftWidth: 1,
  },
  icon: {
    textAlign: 'center',
    alignSelf: 'center',
    color: theme.primaryColor,
  },
  date: {
    marginBottom: 5,
    fontSize: 14,
    color: theme.grey1,
  },
  title: {
    fontSize: 16,
    color: theme.primaryColor,
  },
  comment: {
    marginTop: 25,
    marginBottom: 5,
    fontSize: 14,
  },
});
