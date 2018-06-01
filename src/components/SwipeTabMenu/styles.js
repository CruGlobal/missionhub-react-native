import { StyleSheet } from 'react-native';

import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.accentColor,
  },
  scrollContainer: {
    height: 48,
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
  menuItemTextActive: {
    color: theme.white,
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
});
