import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  fieldWrap: {
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingTop: 10,
  },
  skipBtnText: {
    ...theme.textBold14,
    color: theme.lightGrey,
  },
  backButtonStyle: {
    color: theme.lightGrey,
  },
  input: {
    ...theme.textLight32,
    flex: 1,
    borderBottomColor: 'transparent',
    color: theme.lightGrey,
    paddingHorizontal: 45,
    minHeight: 90.5,
  },
  badge: {
    paddingHorizontal: 45,
    paddingBottom: 16,
  },
});
