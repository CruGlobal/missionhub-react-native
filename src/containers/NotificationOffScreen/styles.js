import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 60,
    paddingTop: 125,
  },
  text: {
    color: theme.black,
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 50,
  },
  allowRow: {
    padding: 8,
    borderTopWidth: 2,
    borderTopColor: theme.secondaryColor,
    borderBottomWidth: 2,
    borderBottomColor: theme.secondaryColor,
  },
  allowText: {
    flex: 1,
    color: theme.black,
    fontSize: 16,
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
    color: theme.black,
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 1.5,
  },
  allowButtonText: {
    color: theme.white,
  },
});
