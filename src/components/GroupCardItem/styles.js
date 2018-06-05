import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    paddingRight: 30,
  },

  card: {
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
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primaryColor,
    letterSpacing: 1,
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
