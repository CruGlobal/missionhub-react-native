import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  itemContainer: {
    backgroundColor: theme.white,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.extraLightGrey,
  },
  dateText: {
    ...theme.textRegular12,
    color: theme.lightGrey,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    maxWidth: 350,
  },
  itemText: theme.textRegular16,
  boldedItemText: { ...theme.textRegular16, fontWeight: 'bold' },
  wrapStyle: { width: 48, height: 48, borderRadius: 24 },
});
