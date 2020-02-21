import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  list: {
    backgroundColor: theme.extraLightGrey,
  },
  header: {
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: theme.extraLightGrey,
  },
  title: {
    fontSize: 12,
    color: theme.textColor,
    textAlign: 'center',
  },
});
