import { StyleSheet } from 'react-native';

import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.accentColor,
  },
  containerLight: {
    backgroundColor: theme.extraLightGrey,
  },
  scrollContainer: {
    height: theme.swipeTabHeight,
    alignItems: 'stretch',
  },
  menuItem: {
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    color: COLORS.LIGHT_BLUE,
  },
  menuItemTextLight: {
    color: theme.inactiveColor,
  },
  menuItemTextActive: {
    color: theme.white,
  },
  menuItemTextActiveLight: {
    color: theme.primaryColor,
  },
  triangleIndicatorContainer: {
    width: '100%',
    position: 'absolute',
    top: 48,
    alignItems: 'center',
  },
});
