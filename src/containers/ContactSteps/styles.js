import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: theme.extraLightGrey,
  },
  completedStepsButton: {
    backgroundColor: theme.transparent,
    height: 36,
    borderColor: theme.inactiveColor,
    borderWidth: theme.buttonBorderWidth,
    marginHorizontal: 68,
  },
  completedStepsButtonText: {
    color: theme.inactiveColor,
    fontSize: 14,
    letterSpacing: 1,
    lineHeight: 18,
  },
});
