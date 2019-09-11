import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  button: {
    fontSize: 24,
    color: theme.secondaryColor,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  iconWrap: {
    backgroundColor: theme.accentColor,
    width: 48,
    height: 48,
    borderRadius: 25,
    margin: 10,
  },
  text: {
    color: theme.white,
    fontSize: 11,
  },
});
