import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  termsWrap: {
    marginTop: 10,
    marginBottom: 38,
  },
  termsText: {
    ...theme.textRegular12,
    color: theme.white,
    textAlign: 'center',
    paddingHorizontal: 3,
  },
  termsTextLink: {
    ...theme.textRegular12,
    color: theme.white,
    textAlign: 'center',
    paddingHorizontal: 3,
    textDecorationLine: 'underline',
    letterSpacing: 0,
  },
});
