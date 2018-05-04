
import { StyleSheet } from 'react-native';

import theme from '../../theme';
import { isAndroid, isiPhoneX } from '../../utils/common';

function getMarginTop() {
  return isiPhoneX() ? 17 : 0;
}

export default StyleSheet.create({
  header: {
    height: theme.headerHeight,
    backgroundColor: theme.primaryColor,
    paddingTop: isAndroid ? 0 : 20,
  },
  shadow: {
    elevation: 4,
  },
  center: {
    marginTop: getMarginTop(),
  },
  left: {
    paddingLeft: 5,
    marginTop: getMarginTop(),
  },
  right: {
    paddingRight: 5,
    marginTop: getMarginTop(),
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
