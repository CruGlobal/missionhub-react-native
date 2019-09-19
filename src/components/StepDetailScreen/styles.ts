import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  flex1: {
    flex: 1,
  },
  bgWhite: {
    backgroundColor: theme.white,
  },
  backButton: {
    color: theme.inactiveColor,
  },
  body: {
    paddingTop: 26,
    paddingBottom: 14,
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
});
