import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  title: {
    ...theme.textRegular16,
    color: theme.white,
  },
  sectionHeader: {
    backgroundColor: theme.extraLightGrey,
    fontSize: 24,
  },
  sectionHeaderText: {
    ...theme.textLight24,
    padding: 10,
    marginLeft: 10,
  },
  nullContainer: {
    borderRadius: 100,
    width: 150,
    height: 150,
    backgroundColor: theme.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nullTitle: {
    ...theme.textLight24,
    paddingVertical: 30,
  },
  nullText: {
    ...theme.textRegular16,
    maxWidth: 300,
    textAlign: 'center',
  },
});
