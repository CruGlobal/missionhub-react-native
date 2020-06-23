import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: theme.parakeetBlue,
    height: 24,
    marginBottom: 10,
  },
  buttonText: {
    color: theme.white,
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
    height: 16,
  },
});
