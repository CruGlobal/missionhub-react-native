import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  content: {
    borderWidth: 1,
    padding: 16,
  },
  description: {
    borderWidth: 1,
    paddingTop: 12,
    maxHeight: 90,
  },
  fixedHeightDescription: {
    height: 90,
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
