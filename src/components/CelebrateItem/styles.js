import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  content: {
    padding: 16,
  },
  description: {
    paddingTop: 12,
    height: 70, // Any lower and the text may get cut off.  Any higher and the heart and comment icon start to get cut off
  },
  messageText: {
    fontSize: 14,
    justifyContent: 'flex-start',
  },
  challengeLinkButton: {
    marginTop: 4,
  },
  challengeLinkText: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
    color: theme.primaryColor,
    textAlign: 'left',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topLeft: {
    justifyContent: 'flex-start',
  },
});
