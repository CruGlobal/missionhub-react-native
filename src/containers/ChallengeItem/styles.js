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
  },
  icon: {
    margin: 0,
    height: 24,
    width: 24,
  },
  title: {
    color: theme.primaryColor,
    fontSize: 14,
  },
  info: {
    color: theme.grey1,
    fontSize: 12,
  },
});
