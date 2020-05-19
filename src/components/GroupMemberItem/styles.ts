import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  content: {
    paddingVertical: 10,
    paddingLeft: 16,
    paddingRight: 0,
    height: 50,
  },
  detailsWrap: {
    marginTop: 1,
  },
  detailText: {
    fontSize: 14,
    color: theme.grey1,
  },
  detailTextRed: {
    fontSize: 14,
    color: theme.red,
  },
});