import { StyleSheet } from 'react-native';

import theme from '../../../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.red,
  },
  header: {
    backgroundColor: theme.red,
  },
  title: {
    color: theme.white,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  contentContainer: {
    backgroundColor: theme.extraLightGrey,
    height: '100%',
  },
});
