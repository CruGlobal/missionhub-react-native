import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  content: {
    paddingVertical: 10,
    paddingLeft: 16,
    paddingRight: 0,
    height: 48,
  },
  name: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: 'bold',
    color: theme.primaryColor,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  detailText: {
    fontSize: 14,
    lineHeight: 14,
    color: theme.grey1,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  detailTextRed: {
    fontSize: 14,
    color: theme.red,
  },
});
