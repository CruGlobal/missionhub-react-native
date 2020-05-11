import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: theme.white,
  },
  backButton: {
    color: theme.inactiveColor,
  },
  body: {
    paddingTop: 26,
    paddingHorizontal: 32,
  },
  stepTypeBadge: {
    paddingTop: 13,
    paddingHorizontal: 32,
  },
  stepTitleText: {
    fontSize: 32,
    lineHeight: 38,
    fontFamily: 'SourceSansPro-Light',
    fontWeight: '300',
    marginVertical: 16,
    marginHorizontal: 32,
  },
  postTitleTextStyle: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '300',
    color: theme.parakeetBlue,
    marginVertical: 16,
    marginHorizontal: 32,
  },
  personNameStyle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateTextStyle: {
    color: theme.communityThoughtGrey,
    fontSize: 12,
  },
});
