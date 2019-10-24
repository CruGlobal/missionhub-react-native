import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  stepsList: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 96,
  },
  completedStepsButton: {
    backgroundColor: theme.transparent,
    height: 36,
    borderColor: theme.inactiveColor,
    borderWidth: theme.buttonBorderWidth,
    marginHorizontal: 68,
    marginVertical: 15,
  },
  completedStepsButtonText: {
    color: theme.inactiveColor,
    fontSize: 14,
    letterSpacing: 1,
    lineHeight: 18,
  },
});
