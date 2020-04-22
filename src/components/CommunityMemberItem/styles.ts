import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    shadowColor: theme.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderRadius: 8,
    backgroundColor: theme.white,
    marginHorizontal: 0,
    marginVertical: 4,
    paddingVertical: 14,
    paddingLeft: 14,
  },
  name: {
    color: theme.grey,
    fontSize: 16,
  },
  info: {
    color: theme.lightGrey,
    fontSize: 12,
  },
  avatar: {
    marginRight: 8,
  },
});
