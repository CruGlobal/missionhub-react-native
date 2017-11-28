import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: 'center',
  },
  text: {
    color: theme.white,
    fontSize: 16,
  },
  facebookButton: {
    backgroundColor: theme.accentColor,
    width: theme.fullWidth - 70,
    margin: 8,
    height: 48,
  },
  tryButton: {
    backgroundColor: theme.transparent,
    borderWidth: 1,
    borderColor: theme.secondaryColor,
    width: theme.fullWidth - 70,
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
    letterSpacing: 1.5,
  },
});
