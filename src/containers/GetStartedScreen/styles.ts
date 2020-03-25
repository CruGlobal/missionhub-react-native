import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  content: {
    paddingVertical: 36,
    paddingHorizontal: 60,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  headerTitle: {
    color: theme.secondaryColor,
    fontSize: 48,
  },
  text: {
    color: theme.white,
    fontSize: 24,
    textAlign: 'left',
    paddingVertical: 10,
    lineHeight: 32,
  },
});
