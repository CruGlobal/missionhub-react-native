import { StyleSheet } from 'react-native';

import theme from '../../theme';
import { hasNotch } from '../../utils/common';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  fieldWrap: {
    paddingTop: 10,
  },
  skipBtn: {
    marginTop: hasNotch() ? 17 : 0,
    padding: 30,
  },
  skipBtnText: {
    fontSize: 14,
    color: theme.lightGrey,
    fontWeight: 'bold',
  },
  backButtonStyle: {
    color: theme.lightGrey,
  },
  input: {
    borderBottomColor: 'transparent',
    fontSize: 32,
    color: theme.lightGrey,
    paddingHorizontal: 45,
    fontFamily: 'SourceSansPro-Light',
    minHeight: 90.5,
  },
});
