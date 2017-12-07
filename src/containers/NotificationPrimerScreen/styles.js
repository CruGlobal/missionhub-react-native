import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 60,
    justifyContent: 'center',
  },
  text: {
    paddingTop: 15,
    color: theme.white,
    fontSize: 16,
    textAlign: 'center',
  },
  allowButton: {
    backgroundColor: theme.secondaryColor,
    width: theme.fullWidth - 70,
    margin: 8,
    height: 48,
  },
  notNowButton: {
    backgroundColor: theme.transparent,
    borderWidth: 1,
    borderColor: theme.secondaryColor,
    width: theme.fullWidth - 70,
    margin: 8,
    height: 48,
  },
  buttonText: {
    color: theme.white,
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 1.5,
  },
});
