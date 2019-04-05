import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    marginHorizontal: 0,
    marginVertical: 0,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: theme.red,
  },
  icon: {
    color: theme.white,
  },
  text: {
    marginLeft: 15,
    color: theme.white,
  },
});
