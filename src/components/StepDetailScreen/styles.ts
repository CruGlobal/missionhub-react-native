import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: theme.white,
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
    ...theme.textLight32,
    marginVertical: 16,
    marginHorizontal: 32,
  },
  personNameStyle: theme.textBold16,
});
