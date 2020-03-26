import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  content: {
    paddingVertical: 36,
    paddingHorizontal: 60,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  descriptionText: {
    color: theme.white,
    textAlign: 'left',
    paddingVertical: 10,
    fontSize: 24,
    lineHeight: 32,
  },
  headerText: {
    color: theme.secondaryColor,
    fontSize: 48,
  },
  filledButton: {
    backgroundColor: theme.secondaryColor,
    margin: 8,
    height: 48,
    width: theme.fullWidth - 80,
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
  signInWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 32,
  },
});
