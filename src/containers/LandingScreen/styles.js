import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    justifyContent: 'center',
  },
  buttonWrapper: {
    paddingHorizontal: 30,
  },
  pillButtonWrapper: {
    marginBottom: 60,
  },
  button: {
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
  memberText: {
    fontSize: 14,
    color: theme.secondaryColor,
    fontWeight: '500',
    paddingTop: 2,
    letterSpacing: 1.5,
    marginRight: 10,
    marginBottom: 20,
  },
  signInBtnText: {
    marginRight: 10,
    marginBottom: 20,
  },
});
