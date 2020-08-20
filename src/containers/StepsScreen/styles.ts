import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: theme.extraLightGrey,
  },
  list: {
    paddingVertical: 8,
  },
  headerTitle: theme.textRegular16,
  nullWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nullHeader: {
    ...theme.textAmatic42,
    color: theme.primaryColor,
    paddingTop: 10,
  },
  nulltextWrapper: {
    paddingHorizontal: 70,
    paddingVertical: 10,
  },
  nullText: {
    ...theme.textRegular16,
    textAlign: 'center',
  },
});
