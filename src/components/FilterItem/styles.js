import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  row: {
    padding: 13,
    backgroundColor: theme.white,
    borderBottomWidth: theme.separatorHeight,
    borderBottomColor: theme.separatorColor,
  },
  switchRow: {
    paddingVertical: 7,
  },
  name: {
    flex: 1,
    fontSize: 14,
  },
  anyText: {
    width: theme.fullWidth / 2,
    textAlign: 'right',
    fontSize: 14,
    color: theme.grey1,
    paddingRight: 16,
  },
  anyIcon: {
    fontSize: 18,
    color: theme.grey1,
    paddingRight: 10,
  },
  checkIcon: {
    fontSize: 18,
    color: theme.primaryColor,
  },
  switch: {},
});
