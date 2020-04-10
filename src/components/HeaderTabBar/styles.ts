import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  tabContainer: {
    flex: 1,
    height: 50,
    backgroundColor: theme.white,
  },
  tab: {
    height: 50,
    flex: 1,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  tabTextLight: {
    color: theme.inactiveColor,
  },
  tabActive: {
    borderBottomColor: theme.primaryColor,
    borderBottomWidth: 2,
  },
  tabTextActiveLight: {
    color: theme.primaryColor,
  },
});
