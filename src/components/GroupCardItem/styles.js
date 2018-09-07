import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    paddingRight: 30,
  },
  card: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 13,
    backgroundColor: theme.white,
    borderBottomColor: theme.separatorColor,
    borderBottomWidth: theme.separatorHeight,
    marginVertical: 8,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primaryColor,
  },
  contactRow: {
    paddingTop: 4,
  },
  contacts: {
    fontSize: 12,
    color: theme.grey1,
  },
  unassigned: {
    fontSize: 12,
    color: theme.red,
  },
});
