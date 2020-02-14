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
    fontSize: 14,
    color: theme.lightGrey,
    fontWeight: 'bold',
  },
  backButtonStyle: {
    color: theme.lightGrey,
  },
  input: {
    flex: 1,
    borderBottomColor: 'transparent',
    fontSize: 32,
    color: theme.lightGrey,
    paddingHorizontal: 45,
    fontFamily: 'SourceSansPro-Light',
    minHeight: 90.5,
  },
});
