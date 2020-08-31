import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  content: {
    paddingHorizontal: 60,
  },
  headerTitle: {
    ...theme.textAmatic48,
    color: theme.secondaryColor,
  },
  text: {
    ...theme.textRegular16,
    color: theme.white,
    fontSize: 24,
    textAlign: 'left',
    paddingVertical: 10,
    lineHeight: 32,
  },
});
