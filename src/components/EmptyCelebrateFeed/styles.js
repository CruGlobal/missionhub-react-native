import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.white,
  },
  title: {
    fontSize: 42,
    color: theme.primaryColor,
    paddingTop: 10,
  },
  description: {
    fontSize: 16,
    color: theme.textColor,
    paddingHorizontal: 50,
    textAlign: 'center',
    paddingVertical: 10,
  },
});
