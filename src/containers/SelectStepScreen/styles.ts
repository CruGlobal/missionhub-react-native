import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.extraLightGrey,
  },
  headerText: {
    marginHorizontal: 30,
    marginVertical: 35,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '300',
    color: theme.white,
    textAlign: 'center',
    letterSpacing: 2,
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
  stepText: {
    fontSize: 16,
    lineHeight: 22,
  },
  createStepIcon: {
    fontSize: 25,
    color: theme.backgroundColor,
  },
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
