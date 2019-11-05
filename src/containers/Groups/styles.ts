import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  pageContainer: {
    flex: 1,
    backgroundColor: theme.white,
  },
  redPageContainer: {
    flex: 1,
    backgroundColor: theme.red,
  },
  flatList: {
    flex: 1,
    backgroundColor: theme.white,
  },
  scrollView: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: theme.extraLightGrey,
  },
  cardList: {
    flex: 1,
    backgroundColor: theme.extraLightGrey,
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
    color: theme.grey,
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
    flexBasis: 40,
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
  unreadTitle: {
    fontWeight: '400',
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
