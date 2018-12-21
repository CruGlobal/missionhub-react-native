import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  termsWrap: {
    marginTop: 10,
    marginBottom: 38,
  },
  termsText: {
    color: theme.white,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 3,
  },
  termsTextLink: {
    color: theme.white,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 3,
    textDecorationLine: 'underline',
    fontWeight: 'normal',
    letterSpacing: 0,
  },
});
