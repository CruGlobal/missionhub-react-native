import { StyleSheet } from 'react-native';

import { isAndroid } from '../../utils/common';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  backgroundTop: {
    backgroundColor: theme.backgroundColor,
  },
  backgroundBottom: {
    backgroundColor: theme.extraLightGrey,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: theme.extraLightGrey,
  },
  top: {
    width: theme.fullWidth,
    backgroundColor: theme.backgroundColor,
  },
  topEmpty: {
    paddingHorizontal: 27,
    paddingVertical: 32,
  },
  title: {
    fontSize: 36,
    color: theme.white,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
  list: {
    overflow: 'scroll',
    backgroundColor: theme.extraLightGrey,
    paddingBottom: isAndroid ? 50 : undefined,
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
