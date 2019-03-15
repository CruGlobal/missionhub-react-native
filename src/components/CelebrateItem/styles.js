import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  content: {
    padding: 16,
  },
  description: {
    paddingTop: 12,
    fontSize: 14,
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
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topLeft: {
    justifyContent: 'flex-start',
  },
});
