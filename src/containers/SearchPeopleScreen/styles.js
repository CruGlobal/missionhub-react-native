import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: theme.white,
  },
  searchWrap: {
    borderBottomWidth: 1,
    borderBottomColor: theme.secondaryColor,
  },
  input: {
    borderBottomWidth: 0,
    paddingVertical: 5,
    flex: 1,
    fontSize: 16,
    color: theme.white,
  },
  clearIcon: {
    paddingHorizontal: 5,
    fontSize: 16,
  },
  list: {
    borderTopWidth: theme.separatorHeight,
    borderTopColor: theme.separatorColor,
  },
  emptyWrap: {
    paddingTop: 15,
  },
  nullWrap: {
    marginBottom: 40,
  },
  nullHeader: {
    fontSize: 84,
    letterSpacing: 2,
    color: theme.primaryColor,
  },
  nullText: {
    fontSize: 16,
  },
  activeFilterWrap: {
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  activeFilterRow: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 1,
    backgroundColor: theme.grey2,
  },
  activeFilterText: {
    flex: 1,
    fontSize: 14,
    color: theme.white,
  },
  activeFilterIcon: {
    fontSize: 14,
    color: theme.white,
  },
});
