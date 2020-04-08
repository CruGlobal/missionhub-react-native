import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  cardContent: {
    flex: 1,
  },
  headerWrap: {
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 8,
  },
  headerNameWrapper: {
    flexDirection: 'column',
    paddingHorizontal: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTime: {
    fontSize: 12,
    lineHeight: 16,
    color: theme.lightGrey,
  },
  postTextWrap: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  postText: {
    fontSize: 16,
    lineHeight: 24,
  },
  footerWrap: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  addStepWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  commentLikeWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  stepIcon: {
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    position: 'absolute',
    top: 16,
    left: 16,
    height: 11,
    width: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addStepText: {
    paddingLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  topLeft: {
    justifyContent: 'flex-start',
  },
  clearNotificationWrap: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  clearNotificationTouchable: {
    shadowColor: theme.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
    backgroundColor: theme.grey,
    borderRadius: 20,
  },
  clearNotificationIcon: {
    padding: 8,
    color: theme.white,
  },
});
