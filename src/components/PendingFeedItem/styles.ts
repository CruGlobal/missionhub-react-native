import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    marginHorizontal: 7,
  },
  text: theme.textRegular16,
  retryText: {
    ...theme.textRegular16,
    fontFamily: 'SourceSansPro-Bold',
    color: theme.secondaryColor,
  },
});
