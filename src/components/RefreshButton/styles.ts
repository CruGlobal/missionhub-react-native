import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: 15,
    right: 10,
  },
  button: {
    backgroundColor: theme.parakeetBlue,
    height: 24,
  },
  buttonText: {
    color: theme.white,
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
    height: 16,
  },
});
