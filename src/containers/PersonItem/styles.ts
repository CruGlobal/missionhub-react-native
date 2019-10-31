import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    flex: 1,
    height: 70,
    flexDirection: 'row',
  },
  image: {
    width: 32,
    height: 32,
  },
  textWrapper: {
    flex: 1,
    paddingLeft: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  textRow: {
    flexDirection: 'row',
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
  stageButtonWrapper: {
    height: 70,
    paddingLeft: 16,
    paddingRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageEmptyWrapper: {
    height: 70,
    width: 54,
  },
  stepButtonWrapper: {
    height: 70,
    paddingLeft: 6,
    paddingRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIcon: {
    color: theme.secondaryColor,
  },
  badge: {
    position: 'absolute',
    bottom: 16,
    left: 20,
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
    bottom: 16,
    left: 24,
    color: theme.secondaryColor,
  },
});
