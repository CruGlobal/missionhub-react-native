import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },
  headerButton: {
    marginHorizontal: 10,
    marginTop: 5,
  },
  headerButtonText: {
    fontSize: 14,
    letterSpacing: 2,
  },
  row: {
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 16,
  },
  selected: {
    color: theme.secondaryColor,
  },
  icon: {
    color: theme.secondaryColor,
  },
});
