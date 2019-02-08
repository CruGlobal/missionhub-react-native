import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.white,
  },
  header: {
    backgroundColor: theme.white,
  },
  backButton: {
    color: theme.inactiveColor,
  },
  removeStepButton: {
    paddingRight: 10,
  },
  removeStepButtonText: {
    color: theme.primaryColor,
    fontSize: 14,
    fontWeight: '400',
  },
});
