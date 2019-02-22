import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  itemStyle: {
    backgroundColor: theme.lightGrey,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  text: { paddingVertical: 3 },
  list: {
    marginHorizontal: 20,
  },
});
