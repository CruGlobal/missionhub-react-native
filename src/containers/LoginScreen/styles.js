import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    justifyContent: 'center',
  },
  text: {
    color: theme.white,
    fontSize: 16,
  },
  buttonWrapper: {
    backgroundColor: '#3EB1C8',
    paddingHorizontal: 30,
  },
  facebookButton: {
    backgroundColor: theme.accentColor,
    margin: 8,
    height: 48,
    alignItems: 'flex-start',
  },
  getStarted: {
    backgroundColor: theme.accentColor,
    alignItems: 'center',
    height: 48,
    width: theme.fullWidth - 80,
    marginVertical: 20,
  },
  icon: {
    marginRight: 10,
  },
  tryButton: {
    backgroundColor: theme.transparent,
    borderWidth: 1,
    borderColor: theme.primaryColor,
    margin: 8,
    height: 48,
  },
  // Give this a bigger clickable area
  signInButton: {
    padding: 2,
    paddingHorizontal: 15,
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
  },
  terms: {
    color: theme.white,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  onboardText: {
    color: theme.primaryColor,
    textAlign: 'center',
    padding: 15,
    fontSize: 16,
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  onboardHeader: {
    fontSize: 42,
    lineHeight: 44,
    letterSpacing: 1.5,
    color: theme.secondaryColor,
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
    color: theme.accentColor,
    fontWeight: '500',
    paddingTop: 2,
    letterSpacing: 1.5,
  },
});
