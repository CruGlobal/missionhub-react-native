import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: theme.headerHeight,
    backgroundColor: theme.primaryColor,
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
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  // HeaderIcon styles
  headerIcon: {
    fontSize: 32,
    backgroundColor: theme.transparent,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // HeaderTwoLine styles
  headerTwoLine: {
    marginTop: 2,
    paddingHorizontal: 10,
  },
  headerTwoLine1: {
    fontSize: 12,
    color: theme.white,
  },
  headerTwoLine2: {
    fontSize: 20,
    color: theme.white,
  },
});
