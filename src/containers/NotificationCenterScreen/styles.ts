import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
});
