import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  label: {
    color: theme.secondaryColor,
    fontSize: 12,
  },
  header: {
    color: theme.secondaryColor,
    fontSize: 36,
    marginBottom: 10,
  },
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
