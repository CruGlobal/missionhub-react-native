import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  likeWrap: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  commentWrap: {
    width: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: 20,
  },
  likeIcon: {
    height: 24,
    width: 24,
  },
  likeCount: {
    ...theme.textRegular14,
    width: 30,
    paddingRight: 10,
    textAlign: 'right',
  },
});
