import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 36,
    paddingVertical: 10,
  },
  headerCard: {
    position: 'relative',
    borderRadius: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    marginBottom: 5,
  },
  headerContainer: {
    paddingVertical: 45,
    padding: 25,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '300',
    color: theme.white,
    textAlign: 'center',
    paddingTop: 10,
  },
  headerBackButtonWrap: {
    position: 'absolute',
    top: 40,
    left: 10,
  },
  icon: {
    marginRight: 10,
    marginLeft: -10,
  },
  largeSize: {
    height: 48,
  },
  noText: {
    width: 20,
  },
  buttonText: {
    fontSize: 14,
    color: theme.white,
    lineHeight: 20,
  },
  story: {
    backgroundColor: theme.communityGodStoryPurple,
  },
  prayer_request: {
    backgroundColor: theme.communityPrayerRequestPurple,
  },
  question: {
    backgroundColor: theme.communityQuestionOrange,
  },
  help_request: {
    backgroundColor: theme.communityCareRequestRed,
  },
  thought: {
    backgroundColor: theme.communityThoughtGrey,
  },
  challenge: {
    backgroundColor: theme.communityChallengeGreen,
  },
  announcement: {
    backgroundColor: theme.communityAnnouncementGrey,
  },
  stepOfFaith: {
    backgroundColor: theme.communityBlue,
  },
});
