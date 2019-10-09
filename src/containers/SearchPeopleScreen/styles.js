import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  pageContainer: {
    backgroundColor: theme.primaryColor,
  },
  searchWrap: {
    borderBottomWidth: 1,
    borderBottomColor: theme.secondaryColor,
    alignSelf: 'stretch',
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
    backgroundColor: theme.white,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 15,
    backgroundColor: theme.white,
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
