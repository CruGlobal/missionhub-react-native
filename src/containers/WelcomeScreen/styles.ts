import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  content: {
    paddingHorizontal: 60,
  },
  descriptionText: {
    ...theme.textLight24,
    color: theme.white,
    textAlign: 'left',
    paddingVertical: 10,
  },
  headerText: {
    ...theme.textAmatic48,
    color: theme.secondaryColor,
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
    ...theme.textBold14,
    color: theme.white,
    paddingTop: 2,
    letterSpacing: 1.5,
  },
});
