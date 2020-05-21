import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
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
  row: {
    flexDirection: 'row',
  },
  postTextWrap: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
    justifyContent: 'flex-start',
  },
  challengeLinkButton: {
    marginTop: 4,
  },
  challengeLinkText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: 0,
    color: theme.primaryColor,
    textAlign: 'left',
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
  commentLikeWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
