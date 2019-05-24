import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  icon: {
    height: 24,
    width: 24,
    borderWidth: 1,
  },
  likeCount: {
    borderWidth: 1,
    width: 30,
    paddingRight: 6,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'right',
    color: theme.lightGrey,
  },
});
