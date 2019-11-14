import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  list: {
    paddingTop: 15,
  },
  nullWrap: {
    marginBottom: 40,
    minHeight: theme.fullHeight - 250,
  },
  nullHeader: {
    fontSize: 84,
    letterSpacing: 2,
    color: theme.primaryColor,
  },
  nullText: {
    fontSize: 16,
  },
  header: {
    paddingTop: 5,
    paddingBottom: 10,
    backgroundColor: theme.primaryColor,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.white,
  },
  content: {
    borderLeftColor: theme.separatorColor,
    borderLeftWidth: 1,
    backgroundColor: theme.white,
  },
});
