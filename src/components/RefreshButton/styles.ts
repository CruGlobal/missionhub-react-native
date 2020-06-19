import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.parakeetBlue,
    marginTop: 13,
    marginRight: 10,
    height: 24,
  },
  buttonText: {
    color: theme.white,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '400',
    letterSpacing: 0,
    paddingBottom: 15,
  },
});
