import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  postStyle: {
    backgroundColor: theme.white,
  },
  textStyle: {
    fontSize: 16,
    color: theme.communityThoughtGrey,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  titleTextStyle: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '300',
    color: theme.parakeetBlue,
    paddingTop: 10,
    paddingBottom: 20,
  },
  bellIcon: {
    fontSize: 18,
    paddingRight: 8,
    color: theme.parakeetBlue,
  },
});
