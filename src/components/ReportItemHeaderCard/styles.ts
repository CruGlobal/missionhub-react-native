import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    marginHorizontal: 0,
    marginVertical: 0,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: theme.orange,
  },
  icon: {
    color: theme.white,
  },
  text: {
    ...theme.textRegular14,
    marginLeft: 15,
    color: theme.white,
  },
});
