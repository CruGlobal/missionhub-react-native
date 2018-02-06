import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    justifyContent: 'center',
  },
  text: {
    color: theme.white,
    fontSize: 16,
  },
  buttonWrapper: {
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 30,
  },
  facebookButton: {
    backgroundColor: theme.secondaryColor,
    margin: 8,
    height: 48,
    alignItems: 'flex-start',
    width: theme.fullWidth - 80,
  },
  icon: {
    marginRight: 10,
  },
  tryButton: {
    backgroundColor: theme.transparent,
    borderWidth: 1,
    borderColor: theme.secondaryColor,
    margin: 8,
    width: theme.fullWidth - 80,
    height: 48,
  },
  // Give this a bigger clickable area
  signInButton: {
    padding: 15,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: theme.white,
    fontWeight: '500',
    fontSize: 14,
    paddingTop: 2,
    letterSpacing: 1.5,
  },
  signInBtnText: {
    color: theme.white,
    fontWeight: '500',
    fontSize: 14,
    paddingTop: 2,
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  termsText: {
    color: theme.white,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 3,
  },
  termsTextLink: {
    color: theme.white,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 3,
    textDecorationLine: 'underline',
  },
  onboardText: {
    color: theme.secondaryColor,
    textAlign: 'center',
    padding: 15,
    fontSize: 16,
    paddingHorizontal: 40,
  },
  onboardHeader: {
    fontSize: 42,
    color: theme.primaryColor,
    textAlign: 'center',
    paddingHorizontal: 70,
  },
  onboardWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.white,
    width: theme.fullWidth,
  },
  onboardImage: {
    width: theme.fullWidth,
  },
  signInText: {
    fontSize: 14,
    color: theme.secondaryColor,
    fontWeight: '500',
    paddingTop: 2,
    letterSpacing: 1.5,
    marginRight: 10,
    marginBottom: 20,
  },
});
