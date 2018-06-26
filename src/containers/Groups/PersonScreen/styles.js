import { StyleSheet } from 'react-native';

import theme from '../../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.lightGrey,
  },
  wrap: {
    backgroundColor: theme.primaryColor,
    paddingVertical: 10,
  },
  name: {
    color: theme.white,
    fontSize: 24,
  },
});
