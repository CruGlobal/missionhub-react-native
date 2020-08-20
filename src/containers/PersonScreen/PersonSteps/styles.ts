import { StyleSheet } from 'react-native';

import theme from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.extraLightGrey,
  },
  list: {
    flex: 1,
    paddingTop: 16,
  },
  completedStepsButtonWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedStepsButton: {
    backgroundColor: theme.transparent,
    height: 36,
    borderColor: theme.lightGrey,
    borderWidth: theme.buttonBorderWidth,
    minWidth: 250,
    marginHorizontal: 20,
    marginVertical: 15,
  },
  completedStepsButtonText: {
    ...theme.textBold14,
    textAlign: 'center',
    backgroundColor: theme.transparent,
    color: theme.lightGrey,
  },
});
