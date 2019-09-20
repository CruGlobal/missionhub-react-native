import { StyleSheet } from 'react-native';

import theme from '../../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.primaryColor,
  },
  wrap: {
    paddingVertical: 10,
  },
  name: {
    color: theme.white,
    fontSize: 24,
  },
});
