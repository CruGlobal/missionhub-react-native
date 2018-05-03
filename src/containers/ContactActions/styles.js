import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.white,
    flex: 1,
  },
  rowWrap: {
    width: '30%',
  },
  iconBtn: {
    backgroundColor: '#E6E8EC',
    height: 72,
    width: 72,
    borderRadius: 40,
    margin: 20,
  },
  iconWrap: {
    height: 72,
  },
  icon: {
    fontSize: 32,
    color: theme.primaryColor,
  },
  commentIcon: {
    fontSize: 26,
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
    width: 80,
  },
});
