import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  textWrap: { alignItems: 'center', marginBottom: 30 },
  inputWrap: { flex: 3, padding: 30 },
  label: {
    ...theme.textRegular12,
    color: theme.secondaryColor,
  },
  header: {
    ...theme.textAmatic36,
    color: theme.secondaryColor,
    marginBottom: 10,
  },
  addPersonText: {
    ...theme.textLight24,
    maxWidth: 230,
    color: theme.white,
    textAlign: 'center',
  },
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
  },
});
