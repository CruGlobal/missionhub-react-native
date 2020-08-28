import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.extraLightGrey,
    flexDirection: 'column',
  },
  flatList: {
    flex: 1,
    backgroundColor: theme.extraLightGrey,
  },
  memberText: {
    ...theme.textLight24,
    paddingHorizontal: 20,
  },
});
