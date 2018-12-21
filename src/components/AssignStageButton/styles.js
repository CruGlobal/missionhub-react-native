import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  assignButton: {
    paddingVertical: 8,
    borderRadius: 25,
    minWidth: 200,
    alignSelf: 'center',
    marginVertical: 8,
  },
  assignButtonText: {
    fontSize: 14,
  },
  buttonWithNoStage: {
    backgroundColor: theme.red,
  },
  buttonWithStage: {
    backgroundColor: theme.secondaryColor,
  },
});
