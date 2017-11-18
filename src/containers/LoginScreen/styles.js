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
  },
  tryButton: {
    backgroundColor: theme.transparent,
    borderWidth: 1,
    borderColor: theme.secondaryColor,
  },
  buttonText: {
    color: theme.white,
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 1.5,
  },
});
