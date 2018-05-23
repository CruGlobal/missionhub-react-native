import { StyleSheet } from 'react-native';

import theme from '../../theme';
import { isiPhoneX } from '../../utils/common';

export default StyleSheet.create({
  label: {
    color: theme.secondaryColor,
    fontSize: 12,
  },
  header: {
    fontSize: 24,
    textAlign: 'left',
    paddingRight: 80,
    paddingLeft: 30,
    color: theme.white,
    lineHeight: 32,
  },
  errorBar: {
    backgroundColor: '#FF5532',
    height: isiPhoneX() ? 85 : 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    color: theme.white,
    fontSize: 16,
    marginTop: isiPhoneX() ? 28 : 12,
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
