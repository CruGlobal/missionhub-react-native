import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  row: {
    paddingVertical: 30,
    paddingRight: 24,
    width: theme.fullWidth,
    borderBottomColor: theme.separatorColor,
    borderBottomWidth: theme.separatorHeight,
  },
  icon: {
    textAlign: 'center',
    alignSelf: 'center',
    color: theme.primaryColor,
  },
  content: {
    paddingLeft: 15,
    borderLeftColor: theme.separatorColor,
    borderLeftWidth: 1,
  },
  date: {
    color: theme.inactiveColor,
    fontSize: 10,
  },
  title: {
    color: theme.primaryColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 13,
  },
  unassigned: {
    color: theme.red,
  },
  uncontacted: {
    color: theme.red,
  },
});
