import { StyleSheet } from 'react-native';

import theme from '../../theme';
import markdownStyles from '../../markdownStyles';

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
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  globalHeaderNameWrapper: {
    paddingHorizontal: 0,
  },
  communityName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  communityPhotoWrapStyles: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  headerTime: {
    fontSize: 12,
    lineHeight: 16,
    color: theme.lightGrey,
  },
  headerTextOnly: {
    fontSize: 16,
    lineHeight: 20,
    color: theme.parakeetBlue,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
  },
  postTextWrap: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    justifyContent: 'flex-start',
    paddingBottom: 8,
  },
  challengeLinkButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeLinkText: {
    fontSize: 16,
    lineHeight: 24,
    textDecorationLine: 'underline',
    textDecorationColor: theme.parakeetBlue,
    fontWeight: '400',
    letterSpacing: 0,
    textAlign: 'left',
    marginBottom: 10,
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
  challengeIcon: {
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
  popupMenuWrap: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  popupButton: {
    paddingRight: 12,
    paddingLeft: 30,
    paddingVertical: 5,
  },
});

export const markdown = StyleSheet.create({
  ...markdownStyles,
  body: {
    ...markdownStyles.body,
    fontSize: 14,
    lineHeight: 18,
  },
});
