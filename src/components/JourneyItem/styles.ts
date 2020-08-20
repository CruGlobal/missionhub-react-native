import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  row: {
    paddingVertical: 19,
    paddingRight: 24,
    backgroundColor: theme.white,
    width: theme.fullWidth,
  },
  icon: {
    fontSize: 40,
    textAlign: 'center',
    alignSelf: 'center',
    color: theme.primaryColor,
  },
  commentIcon: {
    fontSize: 32,
  },
  textWrap: {
    borderLeftColor: theme.separatorColor,
    borderLeftWidth: 1,
    paddingLeft: 20,
    paddingBottom: 5,
  },
  date: {
    ...theme.textRegular10,
    color: theme.lightGrey,
  },
  title: {
    ...theme.textRegular16,
    color: theme.primaryColor,
  },
  text: theme.textRegular14,
  question: {
    ...theme.textRegular14,
    marginTop: 8,
    color: theme.lightGrey,
  },
});
