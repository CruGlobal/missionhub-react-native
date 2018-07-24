import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: theme.white,
  },
  searchWrap: {
    backgroundColor: theme.lightGrey,
    paddingLeft: 15,
    paddingVertical: 15,
  },
  searchFilterWrap: {
    paddingRight: 5,
  },
  inputWrap: {
    paddingRight: 5,
    paddingLeft: 13,
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
    fontSize: 16,
    color: theme.grey2,
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
  nullText: {
    fontSize: 16,
  },
  activeFilterWrap: {
    marginTop: 7,
    paddingTop: 5,
    paddingHorizontal: 6,
  },
  activeFilterRow: {
    paddingLeft: 10,
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
    fontSize: 16,
    color: theme.white,
  },
});
