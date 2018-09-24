import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  flatList: {
    flex: 1,
    backgroundColor: theme.white,
  },
  cardList: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: theme.lightGrey,
  },
  cardSectionHeader: {
    marginVertical: 8,
    fontSize: 14,
    alignContent: 'center',
  },
  onboardingCard: {
    position: 'relative',
    backgroundColor: theme.white,
    borderRadius: 0,
    marginBottom: 5,
  },
  onboardingContainer: {
    paddingTop: 35,
    padding: 25,
  },
  onboardingImage: {
    height: 60,
  },
  onboardingHeader: {
    fontSize: 42,
    color: theme.primaryColor,
    textAlign: 'center',
    paddingTop: 5,
  },
  onboardingDescription: {
    fontSize: 16,
    color: theme.inactiveColor,
    paddingHorizontal: 40,
    textAlign: 'center',
    paddingVertical: 5,
  },
  onboardingIconWrap: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  onboardingIcon: {
    fontSize: 12,
    color: theme.primaryColor,
  },
});
