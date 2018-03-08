import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 40,
  },
  title: {
    color: theme.secondaryColor,
    fontSize: 32,
    textAlign: 'center',
    paddingTop: 50,
    paddingBottom: 10,
  },
  text: {
    color: theme.white,
    fontSize: 16,
    textAlign: 'center',
    paddingBottom: 50,
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
    color: theme.white,
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
    color: theme.white,
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 1.5,
  },
  allowButtonText: {
    color: theme.white,
  },
});
