import { StyleSheet } from 'react-native';

import theme from '../../../theme';

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
  forcedLogoutHeader: {
    fontSize: 24,
    textAlign: 'left',
    paddingRight: 80,
    paddingLeft: 30,
    color: theme.white,
    lineHeight: 32,
  },
  header: {
    color: theme.secondaryColor,
    fontSize: 48,
  },
  errorBar: {
    backgroundColor: '#FF5532',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    color: theme.white,
    fontSize: 16,
  },
  socialButton: {
    width: theme.fullWidth - 80,
    height: 48,
    margin: 8,
  },
  facebookButton: {
    backgroundColor: theme.transparent,
    borderWidth: 1,
    borderColor: theme.secondaryColor,
  },
  buttonText: {
    color: theme.white,
    fontWeight: '500',
    fontSize: 14,
    paddingTop: 2,
    letterSpacing: 1.5,
  },
  icon: {
    marginRight: 10,
  },
  forgotPasswordButton: {
    width: 130,
  },
  forgotPasswordText: {
    paddingVertical: 10,
    textAlign: 'left',
    color: theme.secondaryColor,
    fontSize: 16,
    fontWeight: 'normal',
    letterSpacing: 0,
  },
});
