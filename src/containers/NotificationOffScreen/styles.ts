import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 40,
  },
  imageWrap: {
    paddingVertical: 50,
  },
  title: {
    ...theme.textRegular16,
    color: theme.secondaryColor,
    fontSize: 32,
    lineHeight: 32,
    textAlign: 'center',
    paddingBottom: 10,
  },
  text: {
    ...theme.textRegular16,
    color: theme.white,
    textAlign: 'center',
  },
  allowText: {
    ...theme.textRegular16,
    flex: 1,
    color: theme.white,
  },
  buttonWrap: {
    paddingTop: 20,
  },
  button: {
    width: theme.fullWidth - 70,
    margin: 8,
    height: 48,
  },
  allowButton: {
    backgroundColor: theme.secondaryColor,
  },
  notNowButton: {
    backgroundColor: theme.transparent,
    borderWidth: 1,
    borderColor: theme.secondaryColor,
  },
  buttonText: {
    ...theme.textBold14,
    color: theme.white,
    letterSpacing: 1.5,
  },
});
