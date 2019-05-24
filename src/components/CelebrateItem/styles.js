import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  content: {
    borderWidth: 1,
    padding: 14,
  },
  description: {
    borderWidth: 1,
    marginTop: 14,
    maxHeight: 90,
  },
  fixedHeightDescription: {
    height: 90,
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
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topLeft: {
    justifyContent: 'flex-start',
  },
});
