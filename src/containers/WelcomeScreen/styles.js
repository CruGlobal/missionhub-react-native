import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 60,
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
});
