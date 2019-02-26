import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  removeStepButton: {
    paddingRight: 10,
  },
  removeStepButtonText: {
    color: theme.inactiveColor,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
