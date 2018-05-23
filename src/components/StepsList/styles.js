import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  stepName: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  addIcon: {
    fontSize: 40,
    margin: 15,
    color: theme.secondaryColor,
  },
  separatorWrap: {
    borderTopWidth: theme.separatorHeight,
    borderTopColor: theme.separatorColor,
    borderBottomWidth: theme.separatorHeight,
    borderBottomColor: theme.separatorColor,
  },
  loadMoreStepsButton: {
    backgroundColor: theme.white,
    height: 48,
    width: theme.fullWidth - 80,
    borderColor: theme.secondaryColor,
    borderWidth: theme.buttonBorderWidth,
  },
  loadMoreStepsButtonText: {
    color: theme.secondaryColor,
    fontSize: 14,
    letterSpacing: 2,
    lineHeight: 24,
  },
});
