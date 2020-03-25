import { StyleSheet } from 'react-native';

import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  containerLight: {
    flex: 1,
    backgroundColor: theme.extraLightGrey,
  },
  scrollContainer: {
    height: theme.swipeTabHeight,
    alignItems: 'stretch',
  },
  parallaxContent: {
    marginLeft: 24,
    marginRight: 64,
    marginBottom: 5,
  },
  orgName: {
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 38,
    color: theme.white,
  },
  menuItem: {
    height: 50,
    flex: 1,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  menuItemText: {
    color: COLORS.LIGHT_BLUE,
  },
  menuItemTextLight: {
    color: theme.inactiveColor,
  },
  menuItemActive: {
    borderBottomColor: theme.primaryColor,
    borderBottomWidth: 2,
  },
  menuItemTextActive: {
    color: theme.white,
  },
  menuItemTextActiveLight: {
    color: theme.primaryColor,
  },
  triangleContainer: {
    width: '100%',
    position: 'absolute',
    top: 48,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.accentColor,
    transform: [{ rotate: '180deg' }],
  },
  triangleLight: {
    borderBottomColor: theme.extraLightGrey,
  },
});
