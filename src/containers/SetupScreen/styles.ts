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
    color: theme.secondaryColor,
    fontSize: 12,
  },
  header: {
    color: theme.secondaryColor,
    fontSize: 36,
    marginBottom: 10,
  },
  addPersonText: {
    color: theme.white,
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 30,
    textAlign: 'center',
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
