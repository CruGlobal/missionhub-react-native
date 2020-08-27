import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.extraLightGrey,
  },
  headerText: {
    ...theme.textLight24,
    marginHorizontal: 30,
    marginVertical: 35,
    color: theme.white,
    textAlign: 'center',
  },
  collapsibleView: {
    flex: 1,
  },
  contentContainerStyle: {
    marginTop: 12,
    paddingBottom: 24,
  },
  card: {
    marginHorizontal: 20,
    marginVertical: 6,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepText: theme.textRegular16,
  completedCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 3,
    paddingHorizontal: 14,
    borderRadius: 30,
  },
  completedCountBadgeText: { color: theme.primaryColor, marginRight: 4 },
});
