import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: theme.transparent,
  },
  header: {
    flexDirection: 'row',
    height: theme.headerHeight,
    paddingTop: 0,
  },
  shadow: {
    elevation: 4,
  },
  center: {},
  left: {
    paddingLeft: 5,
  },
  right: {
    paddingRight: 5,
  },
  title: {
    ...theme.textRegular14,
    color: 'white',
  },
});
