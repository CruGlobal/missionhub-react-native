import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  header: {
    backgroundColor: theme.white,
  },
  button: {
    paddingRight: 10,
  },
  buttonText: {
    color: theme.primaryColor,
    fontSize: 14,
    fontWeight: '400',
  },
});
