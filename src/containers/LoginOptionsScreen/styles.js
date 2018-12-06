import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    justifyContent: 'center',
  },
  headerContainer: {
    paddingHorizontal: 48,
  },
  headerText: {
    color: theme.secondaryColor,
    fontSize: 36,
  },
  descriptionText: {
    color: theme.white,
    paddingVertical: 10,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  buttonWrapper: {
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 30,
  },
  icon: {
    marginRight: 10,
  },
  clearButton: {
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
  signInBtnText: {
    color: theme.white,
    fontWeight: '500',
    fontSize: 14,
    paddingTop: 2,
    letterSpacing: 1.5,
    marginBottom: 20,
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
