import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  itemWrap: {
    padding: 20,
    borderBottomColor: theme.grey,
    borderBottomWidth: theme.separatorHeight,
  },
  item: {
    marginHorizontal: 0,
    marginVertical: 0,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: theme.red,
  },
  itemIcon: {
    color: theme.white,
  },
  itemText: {
    marginLeft: 15,
    color: theme.white,
  },
  bothPadding: {
    padding: 4,
  },
  commentCard: {
    marginHorizontal: 0,
    marginVertical: 0,
    borderRadius: 8,
    backgroundColor: theme.grey,
  },
  commentCardContent: {
    borderBottomColor: theme.white,
    borderBottomWidth: 1,
    width: '100%',
  },
});
