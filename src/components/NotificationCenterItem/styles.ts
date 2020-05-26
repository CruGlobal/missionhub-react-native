import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  itemContainer: {
    backgroundColor: theme.white,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.extraLightGrey,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  sectionHeader: {
    backgroundColor: theme.extraLightGrey,
    fontSize: 24,
    fontWeight: '300',
    paddingHorizontal: 10,
  },
  dateText: {
    fontSize: 12,
    lineHeight: 16,
    color: theme.lightGrey,
  },
  itemText: {
    fontSize: 16,
    lineHeight: 20,
    color: '#505256',
  },
  boldedItemText: {
    fontWeight: '600',
  },
});
