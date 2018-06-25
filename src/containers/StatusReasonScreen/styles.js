import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  headerButton: {
    width: 80,
    marginHorizontal: 10,
    marginTop: 5,
  },
  headerButtonText: {
    fontSize: 14,
    letterSpacing: 2,
    textAlign: 'right',
  },
  content: {
    marginTop: 50,
    paddingHorizontal: 35,
  },
  text: {
    fontSize: 24,
    color: theme.white,
    marginBottom: 40,
  },
  input: {},
});
