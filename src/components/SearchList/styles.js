import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: theme.white,
  },
  searchWrap: {
    backgroundColor: theme.grey1,
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  searchFilterWrap: {
    paddingRight: 5,
  },
  inputWrap: {
    paddingHorizontal: 13,
    backgroundColor: theme.white,
    borderRadius: 25,
  },
  input: {
    borderBottomWidth: 0,
    paddingVertical: 5,
    flex: 1,
    fontSize: 16,
    color: theme.grey2,
  },
  clearIcon: {
    paddingHorizontal: 5,
    fontSize: 16,
  },
  filterButton: {
    color: theme.grey2,
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
    marginTop: 7,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  activeFilterRow: {
    paddingHorizontal: 10,
    marginTop: 1,
    borderRadius: 5,
    marginRight: 5,
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
