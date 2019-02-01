import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  content: {
    padding: 16,
  },
  icon: {
    margin: 0,
    height: 24,
    width: 24,
  },
  name: {
    color: theme.primaryColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    color: theme.grey1,
    fontSize: 12,
  },
  description: {
    paddingTop: 12,
    fontSize: 14,
    minHeight: 70, // Any lower and the text may get cut off
  },
  likeCount: {
    fontSize: 14,
    color: theme.textColor,
  },
  challengeLinkButton: {
    marginTop: 4,
  },
  challengeLinkText: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
    color: theme.primaryColor,
  },
});
