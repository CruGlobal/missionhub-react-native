import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  list: {
    paddingVertical: 16,
    backgroundColor: theme.transparent,
  },
  headerIcon: {
    fontSize: 40,
    color: theme.secondaryColor,
  },
  headerTitle: {
    fontSize: 36,
    lineHeight: 48,
    letterSpacing: 2,
    color: theme.secondaryColor,
  },
  headerText: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.white,
    paddingHorizontal: 50,
    paddingBottom: 36,
    textAlign: 'center',
  },
  collapsedHeaderTitle: {
    fontSize: 14,
    color: theme.white,
  },
  loadMoreStepsButton: {
    backgroundColor: theme.transparent,
    height: 36,
    borderColor: theme.inactiveColor,
    borderWidth: theme.buttonBorderWidth,
    marginTop: 18,
    marginHorizontal: 68,
  },
  loadMoreStepsButtonText: {
    color: theme.inactiveColor,
    fontSize: 14,
    letterSpacing: 1,
    lineHeight: 18,
  },
});
