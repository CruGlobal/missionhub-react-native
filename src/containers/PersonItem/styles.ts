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
  uncontactedIcon: {
    fontSize: 24,
    color: theme.red,
  },
});
