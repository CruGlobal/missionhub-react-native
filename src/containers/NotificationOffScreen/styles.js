import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 40,
  },
  imageWrap: {
    paddingVertical: 50,
  },
  title: {
    color: theme.secondaryColor,
    fontSize: 32,
    textAlign: 'center',
    paddingBottom: 10,
  },
  text: {
    color: theme.white,
    fontSize: 16,
    textAlign: 'center',
  },
  allowText: {
    flex: 1,
    color: theme.white,
    fontSize: 16,
  },
  buttonWrap: {
    paddingTop: 50,
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
    color: theme.white,
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 1.5,
  },
});
