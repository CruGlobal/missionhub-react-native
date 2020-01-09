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
    paddingBottom: 32,
    paddingHorizontal: 32,
  },
  extraPadding: {
    paddingBottom: 86,
  },
  stepTitleText: {
    fontSize: 32,
    lineHeight: 38,
    fontFamily: 'SourceSansPro-Light',
    fontWeight: '300',
    marginVertical: 16,
    marginHorizontal: 32,
  },
});
