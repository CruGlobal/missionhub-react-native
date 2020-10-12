import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  wrap: {
    backgroundColor: theme.transparent,
    paddingVertical: 10,
    marginBottom: 80,
  },
  section: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderBottomColor: theme.extraLightGrey,
    borderBottomWidth: 1,
  },
  detailSection: {
    paddingVertical: 14,
    paddingHorizontal: 0,
  },
  title: theme.textLight24,
  subHeader: {
    ...theme.textRegular12,
    color: theme.lightGrey,
    paddingHorizontal: 32,
  },
  dateText: theme.textRegular16,
});
