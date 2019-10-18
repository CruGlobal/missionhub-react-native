import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    flex: 1,
    height: 70,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  image: {
    width: 32,
    height: 32,
  },
  textWrapper: {
    flex: 1,
    paddingLeft: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  stage: {
    paddingTop: 6,
    fontSize: 12,
    lineHeight: 14,
    color: theme.inactiveColor,
  },
  addStage: {
    color: theme.secondaryColor,
  },
  uncontacted: {
    color: theme.red,
  },
  stepIcon: {
    color: theme.secondaryColor,
  },
  badge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    backgroundColor: theme.red,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: theme.white,
  },
  stepPlusIcon: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    color: theme.secondaryColor,
  },
});
