import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.extraLightGrey,
  },
  list: {
    paddingTop: 16,
  },
  completedStepsButtonWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedStepsButton: {
    backgroundColor: theme.transparent,
    height: 36,
    borderColor: theme.inactiveColor,
    borderWidth: theme.buttonBorderWidth,
    minWidth: 250,
    marginHorizontal: 20,
    marginVertical: 15,
  },
  completedStepsButtonText: {
    textAlign: 'center',
    fontWeight: '500',
    backgroundColor: 'rgba(0,0,0,0)',
    color: theme.inactiveColor,
    fontSize: 14,
    letterSpacing: 1,
    lineHeight: 18,
  },
});
