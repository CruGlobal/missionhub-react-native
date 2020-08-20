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
    ...theme.textRegular12,
    color: theme.secondaryColor,
  },
  forcedLogoutHeader: {
    ...theme.textRegular16,
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'left',
    paddingRight: 80,
    paddingLeft: 30,
    color: theme.white,
  },
  header: {
    ...theme.textRegular16,
    color: theme.secondaryColor,
    fontSize: 48,
    lineHeight: 48,
  },
  errorBar: {
    backgroundColor: theme.orange,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    ...theme.textRegular16,
    color: theme.white,
  },
  facebookButton: {
    backgroundColor: theme.transparent,
    borderWidth: 1,
    borderColor: theme.secondaryColor,
    margin: 8,
    width: theme.fullWidth - 80,
    height: 48,
  },
  buttonText: {
    ...theme.textBold16,
    color: theme.white,
    paddingTop: 2,
  },
  icon: {
    marginRight: 10,
  },
  forgotPasswordButton: {
    width: 130,
  },
  forgotPasswordText: {
    ...theme.textRegular16,
    paddingVertical: 10,
    textAlign: 'left',
    color: theme.secondaryColor,
  },
});
