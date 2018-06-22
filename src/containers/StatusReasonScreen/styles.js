import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 60,
  },
  headerButton: {
    marginHorizontal: 10,
    marginTop: 5,
  },
  headerButtonText: {
    fontSize: 14,
    letterSpacing: 2,
  },
  text: {
    fontSize: 24,
  },
});
