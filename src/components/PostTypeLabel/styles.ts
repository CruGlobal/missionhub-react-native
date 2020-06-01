import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 36,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  headerCard: {
    position: 'relative',
    borderRadius: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    marginBottom: 5,
  },
  headerContainer: {
    paddingVertical: 35,
    padding: 25,
  },
  headerIcon: {
    opacity: 0.2,
    position: 'absolute',
    bottom: -75,
    right: -30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '300',
    color: theme.white,
    textAlign: 'center',
    paddingTop: 20,
  },
  subheaderText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.white,
    textAlign: 'center',
    paddingTop: 10,
    paddingHorizontal: 35,
  },
  headerBackButtonWrap: {
    position: 'absolute',
    top: 10,
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
  peopleCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  peopleCardTop: {
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
  },
  peopleCardList: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end' },
  peopleCardBottom: {
    backgroundColor: theme.white,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  peopleCardText: { fontSize: 14 },
  STORY: {
    backgroundColor: theme.communityGodStoryPurple,
  },
  PRAYER_REQUEST: {
    backgroundColor: theme.communityPrayerRequestPurple,
  },
  QUESTION: {
    backgroundColor: theme.communityQuestionOrange,
  },
  HELP_REQUEST: {
    backgroundColor: theme.communityCareRequestRed,
  },
  THOUGHT: {
    backgroundColor: theme.communityThoughtGrey,
  },
  COMMUNITY_CHALLENGE: {
    backgroundColor: theme.communityChallengeGreen,
  },
  ANNOUNCEMENT: {
    backgroundColor: theme.communityAnnouncementGrey,
  },
  STEP: {
    backgroundColor: theme.parakeetBlue,
  },
});
