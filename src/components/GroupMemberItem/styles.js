import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  content: {
    paddingVertical: 10,
    paddingLeft: 16,
    paddingRight: 0,
  },
  detailsWrap: {
    marginTop: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primaryColor,
  },
  assigned: {
    fontSize: 14,
    color: theme.grey1,
  },
  uncontacted: {
    fontSize: 14,
    color: theme.red,
  },
});
