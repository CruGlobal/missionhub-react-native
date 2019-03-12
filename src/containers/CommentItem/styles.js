import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  content: {
    marginTop: 15,
  },
  itemStyle: {
    backgroundColor: theme.white,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 13,
    marginVertical: 5,
  },
  myStyle: {
    backgroundColor: theme.secondaryColor,
  },
  text: {
    paddingVertical: 3,
  },
  myText: {
    color: theme.white,
  },
  name: {
    paddingLeft: 10,
    paddingRight: 5,
    color: theme.white,
  },
});
