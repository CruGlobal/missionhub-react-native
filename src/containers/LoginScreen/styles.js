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
    backgroundColor: theme.secondaryColor,
    paddingHorizontal: 30,
  },
  facebookButton: {
    backgroundColor: theme.accentColor,
    margin: 8,
    height: 48,
    alignItems: 'flex-start',
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
  terms: {
    color: theme.white,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  onboardText: {
    color: theme.secondaryColor,
    textAlign: 'center',
    padding: 5,
    fontSize: 16,
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
    width: theme.fullWidth - 100,
    marginHorizontal: theme.fullWidth / 30,
  },
});
