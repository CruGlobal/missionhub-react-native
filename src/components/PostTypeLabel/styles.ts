import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 36,
    paddingVertical: 0,
    borderRadius: 18,
    paddingLeft: 20,
    paddingRight: 16,
  },
  headerCard: {
    position: 'relative',
    borderRadius: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    flexDirection: 'column',
    shadowOpacity: 0,
  },
  header: { width: '100%', backgroundColor: 'transparent' },
  headerContainer: {
    height: 120,
    position: 'relative',
    paddingHorizontal: 25,
    alignItems: 'center',
    marginBottom: 5,
  },
  headerTitle: theme.textRegular14,
  headerIcon: {
    opacity: 0.4,
    position: 'absolute',
    bottom: -60,
    right: -40,
  },
  headerText: {
    ...theme.textLight24,
    color: theme.white,
    textAlign: 'center',
  },
  subheaderText: {
    ...theme.textRegular14,
    color: theme.white,
    textAlign: 'center',
    paddingTop: 10,
    paddingHorizontal: 35,
  },
  icon: {
    marginRight: 10,
    marginLeft: -10,
  },
  smallIcon: {
    marginRight: 0,
    marginLeft: 0,
  },
  noText: {
    width: 20,
  },
  largeSize: {
    height: 48,
  },
  smallSize: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 0,
    paddingRight: 0,
  },
  buttonText: {
    ...theme.textRegular14,
    color: theme.white,
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
  peopleCardText: theme.textRegular14,
  nullState: {
    paddingHorizontal: 45,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nullStateText: {
    ...theme.textLight32,
    color: theme.lightGrey,
    textAlign: 'center',
  },
  nullStateReferenceText: theme.textBold16,
  colorSTORY: {
    color: theme.communityGodStoryPurple,
  },
  STORY: {
    backgroundColor: theme.communityGodStoryPurple,
  },
  colorPRAYER_REQUEST: {
    color: theme.communityPrayerRequestPurple,
  },
  PRAYER_REQUEST: {
    backgroundColor: theme.communityPrayerRequestPurple,
  },
  colorQUESTION: {
    color: theme.communityQuestionOrange,
  },
  QUESTION: {
    backgroundColor: theme.communityQuestionOrange,
  },
  colorHELP_REQUEST: {
    color: theme.communityHelpRequestRed,
  },
  HELP_REQUEST: {
    backgroundColor: theme.communityHelpRequestRed,
  },
  colorTHOUGHT: {
    color: theme.communityThoughtGrey,
  },
  THOUGHT: {
    backgroundColor: theme.communityThoughtGrey,
  },
  colorACCEPTED_COMMUNITY_CHALLENGE: {
    color: theme.communityChallengeGreen,
  },
  ACCEPTED_COMMUNITY_CHALLENGE: {
    backgroundColor: theme.communityChallengeGreen,
  },
  colorANNOUNCEMENT: {
    color: theme.communityAnnouncementGrey,
  },
  ANNOUNCEMENT: {
    backgroundColor: theme.communityAnnouncementGrey,
  },
  colorSTEP: {
    color: theme.secondaryColor,
  },
  STEP: {
    backgroundColor: theme.secondaryColor,
  },
});
