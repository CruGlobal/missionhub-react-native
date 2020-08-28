import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.white,
  },
  header: {
    ...theme.textRegular16,
    fontSize: 24,
    color: theme.primaryColor,
    paddingTop: 10,
  },
  description: {
    ...theme.textRegular16,
    paddingHorizontal: 80,
    textAlign: 'center',
    paddingVertical: 10,
  },
});
