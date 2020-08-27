import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  editContainer: {
    flex: 1,
    backgroundColor: theme.white,
  },
  headerTitle: theme.textRegular14,
  scrollView: {
    flex: 1,
  },
  disabledButton: {
    opacity: 1,
    backgroundColor: theme.accentColor,
    color: theme.white,
  },
});
