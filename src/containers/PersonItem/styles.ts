import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    flex: 1,
    height: 70,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  textWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  stage: {
    paddingTop: 6,
    fontSize: 12,
    lineHeight: 14,
    color: theme.inactiveColor,
  },
  uncontacted: {
    color: theme.red,
  },
  uncontactedIcon: {
    fontSize: 24,
    color: theme.red,
  },
});
