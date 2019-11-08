import { StyleSheet } from 'react-native';

import { isAndroid } from '../../utils/common';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: theme.extraLightGrey,
  },
  list: {
    overflow: 'scroll',
    backgroundColor: theme.extraLightGrey,
    paddingBottom: isAndroid ? 50 : undefined,
  },
  nullWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nullHeader: {
    fontSize: 42,
    color: theme.primaryColor,
    paddingTop: 10,
  },
  nullText: {
    fontSize: 16,
    color: theme.textColor,
    paddingHorizontal: 70,
    textAlign: 'center',
    paddingVertical: 10,
  },
});
