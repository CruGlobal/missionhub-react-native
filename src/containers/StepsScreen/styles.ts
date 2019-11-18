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
    paddingVertical: 8,
  },
  listExtraPadding: {
    paddingBottom: 40,
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
  nulltextWrapper: {
    paddingHorizontal: 70,
    paddingVertical: 10,
  },
  nullText: {
    fontSize: 16,
    color: theme.textColor,
    textAlign: 'center',
  },
});
