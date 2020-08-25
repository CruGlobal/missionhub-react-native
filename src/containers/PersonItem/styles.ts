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
    ...theme.textRegular12,
    paddingTop: 6,
    color: theme.extraLightGrey,
  },
  addStage: {
    color: theme.secondaryColor,
  },
  stageIconWrapper: {
    height: 70,
    width: 54,
    paddingLeft: 16,
    paddingRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: theme.primaryColor,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    ...theme.textBold14,
    fontSize: 13,
    color: theme.white,
  },
  stepPlusIcon: {
    position: 'absolute',
    bottom: 16,
    left: 24,
    color: theme.secondaryColor,
  },
});
