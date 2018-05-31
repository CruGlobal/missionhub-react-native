import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    paddingRight: 30,
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
