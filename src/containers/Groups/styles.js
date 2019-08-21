import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  tabContainer: {
    flex: 1,
    backgroundColor: theme.extraLightGrey,
  },
  pageContainer: {
    flex: 1,
    backgroundColor: theme.white,
  },
  flatList: {
    flex: 1,
    backgroundColor: theme.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.lightGrey,
  },
  cardList: {
    flex: 1,
    marginVertical: 8,
    backgroundColor: theme.transparent,
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
    marginHorizontal: 0,
    marginVertical: 0,
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
  blockBtn: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    backgroundColor: theme.accentColor,
  },
  blockBtnBorderRight: {
    borderRightWidth: 1,
    borderRightColor: theme.primaryColor,
  },
  blockBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.white,
  },
  unreadHeader: {
    backgroundColor: theme.white,
    shadowColor: theme.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  unreadTitle: {
    color: theme.darkText,
    fontWeight: '400',
  },
  reportHeader: {
    backgroundColor: theme.red,
  },
  reportList: {
    paddingVertical: 15,
  },
  backIcon: {
    color: theme.black,
  },
  clearAllButton: {
    paddingRight: 5,
  },
  clearAllButtonText: {
    fontSize: 10,
    color: theme.black,
  },
});
