import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  headerTitle: theme.textRegular16,
  list: {
    flex: 1,
    backgroundColor: theme.white,
    paddingVertical: 6,
  },
});
