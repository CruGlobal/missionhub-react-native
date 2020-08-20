import { StyleSheet } from 'react-native';

import theme from '../../../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.orange,
  },
  header: {
    backgroundColor: theme.orange,
  },
  title: {
    ...theme.textRegular16,
    color: theme.white,
  },
  contentContainer: {
    backgroundColor: theme.extraLightGrey,
    height: '100%',
  },
});
