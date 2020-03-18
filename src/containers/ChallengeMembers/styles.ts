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
    paddingHorizontal: 20,
    fontSize: 24,
    lineHeight: 30,
    color: theme.grey,
    fontWeight: '300',
  },
});
