import { StyleSheet } from 'react-native';

import theme from '../../../theme';

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
    ...theme.textAmatic36,
    color: theme.secondaryColor,
  },
  descriptionText: {
    ...theme.textRegular16,
    color: theme.white,
    paddingVertical: 10,
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
    ...theme.textBold16,
    color: theme.white,
    paddingTop: 2,
  },
  signInBtnText: {
    ...theme.textBold14,
    color: theme.white,
    paddingTop: 2,
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  signInText: {
    ...theme.textBold14,
    color: theme.secondaryColor,
    paddingTop: 2,
    letterSpacing: 1.5,
    marginRight: 10,
    marginBottom: 20,
  },
});
