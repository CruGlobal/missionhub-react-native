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
  },
  likeCount: {
    fontSize: 14,
    color: theme.textColor,
  },
});
