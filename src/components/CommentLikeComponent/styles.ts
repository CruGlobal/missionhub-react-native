import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconAndCountWrap: {
    width: 60,
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
  },
  icon: {
    height: 24,
    width: 24,
    marginRight: 20,
  },
  likeCount: {
    width: 30,
    paddingRight: 10,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'right',
  },
});
