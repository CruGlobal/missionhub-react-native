import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  tabContainer: {
    minWidth: '100%',
    height: 50,
    backgroundColor: theme.white,
  },
  tab: {
    flexGrow: 1,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  tabText: theme.textRegular16,
  tabActive: {
    borderBottomColor: theme.secondaryColor,
    borderBottomWidth: 2,
  },
  tabTextActive: {
    ...theme.textRegular16,
    color: theme.secondaryColor,
  },
});
