import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    paddingRight: 30,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.white,
    borderBottomColor: theme.separatorColor,
    borderBottomWidth: theme.separatorHeight,
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
