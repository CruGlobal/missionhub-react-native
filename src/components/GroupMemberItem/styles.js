import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.white,
  },
  row: {
    paddingVertical: 16,
    paddingLeft: 24,
    paddingRight: 13,
    backgroundColor: theme.white,
    borderBottomColor: theme.separatorColor,
    borderBottomWidth: theme.separatorHeight,
  },
  detailsWrap: {
    marginTop: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primaryColor,
  },
  assigned: {
    fontSize: 14,
    color: theme.grey1,
  },
  uncontacted: {
    fontSize: 14,
    color: theme.red,
  },
});
