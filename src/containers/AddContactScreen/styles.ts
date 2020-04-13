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
  headerTitle: {
    color: theme.grey,
    fontFamily: 'SourceSansPro-Light',
    fontWeight: '400',
  },
  scrollView: {
    flex: 1,
  },
  disabledButton: {
    opacity: 1,
    backgroundColor: theme.accentColor,
    color: '#007398',
  },
});
