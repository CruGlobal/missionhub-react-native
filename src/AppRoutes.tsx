/* eslint max-lines: 0 */

import React from 'react';
import {
  createStackNavigator,
  StackViewTransitionConfigs,
} from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

import LandingScreen, { LANDING_SCREEN } from './containers/LandingScreen';
import StepsScreen from './containers/StepsScreen';
import PeopleScreen from './containers/PeopleScreen';
import AddChallengeScreen, {
  ADD_CHALLENGE_SCREEN,
} from './containers/AddChallengeScreen';
import ChallengeDetailScreen, {
  CHALLENGE_DETAIL_SCREEN,
} from './containers/ChallengeDetailScreen';
import StepReminderScreen, {
  STEP_REMINDER_SCREEN,
} from './containers/StepReminderScreen';
import SuggestedStepDetailScreen, {
  SUGGESTED_STEP_DETAIL_SCREEN,
} from './containers/SuggestedStepDetailScreen';
import AcceptedStepDetailScreen, {
  ACCEPTED_STEP_DETAIL_SCREEN,
} from './containers/AcceptedStepDetailScreen';
import CompletedStepDetailScreen, {
  COMPLETED_STEP_DETAIL_SCREEN,
} from './containers/CompletedStepDetailScreen';
import SelectStageScreen, {
  SELECT_STAGE_SCREEN,
} from './containers/SelectStageScreen';
import AddSomeoneScreen, {
  ADD_SOMEONE_SCREEN,
} from './containers/AddSomeoneScreen';
import AddContactScreen, {
  ADD_CONTACT_SCREEN,
} from './containers/AddContactScreen';
import NotificationPrimerScreen, {
  NOTIFICATION_PRIMER_SCREEN,
} from './containers/NotificationPrimerScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from './containers/CelebrationScreen';
import SearchPeopleScreen, {
  SEARCH_SCREEN,
} from './containers/SearchPeopleScreen';
import SearchPeopleFilterScreen, {
  SEARCH_FILTER_SCREEN,
} from './containers/SearchPeopleFilterScreen';
import SearchPeopleFilterRefineScreen, {
  SEARCH_REFINE_SCREEN,
} from './containers/SearchPeopleFilterRefineScreen';
import NotificationOffScreen, {
  NOTIFICATION_OFF_SCREEN,
} from './containers/NotificationOffScreen';
import {
  ALL_PERSON_TAB_ROUTES,
  ContactPersonScreen,
  IsGroupsMeCommunityPersonScreen,
  IsGroupsMemberPersonScreen,
  IsUserCreatedMemberPersonScreen,
  MeCommunityPersonScreen,
  MemberPersonScreen,
  MePersonalPersonScreen,
} from './containers/Groups/AssignedPersonScreen';
import {
  CONTACT_PERSON_SCREEN,
  IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN,
  IS_GROUPS_MEMBER_PERSON_SCREEN,
  IS_USER_CREATED_MEMBER_PERSON_SCREEN,
  ME_COMMUNITY_PERSON_SCREEN,
  ME_PERSONAL_PERSON_SCREEN,
  MEMBER_PERSON_SCREEN,
} from './containers/Groups/AssignedPersonScreen/constants';
import SettingsMenu from './components/SettingsMenu';
import { PersonSideMenu } from './components/PersonSideMenu';
import theme from './theme';
import {
  MAIN_TABS,
  PEOPLE_TAB,
  STEPS_TAB,
  COMMUNITIES_TAB,
  NOTIFICATIONS_TAB,
} from './constants';
import { buildTrackingObj, isAndroid } from './utils/common';
import GroupsListScreen from './containers/Groups/GroupsListScreen';
import GroupReport, {
  GROUPS_REPORT_SCREEN,
} from './containers/Groups/GroupReport';
import UnassignedPersonScreen, {
  UNASSIGNED_PERSON_SCREEN,
} from './containers/Groups/UnassignedPersonScreen';
import SurveyContactsFilter, {
  SEARCH_SURVEY_CONTACTS_FILTER_SCREEN,
} from './containers/Groups/SurveyContactsFilter';
import SurveyQuestionsFilter, {
  SEARCH_QUESTIONS_FILTER_SCREEN,
} from './containers/Groups/SurveyQuestionsFilter';
import ContactsFilter, {
  SEARCH_CONTACTS_FILTER_SCREEN,
} from './containers/Groups/ContactsFilter';
import CreateGroupScreen, {
  CREATE_GROUP_SCREEN,
} from './containers/Groups/CreateGroupScreen';
import StatusSelect, {
  STATUS_SELECT_SCREEN,
} from './containers/StatusSelectScreen';
import StatusComplete, {
  STATUS_COMPLETE_SCREEN,
} from './containers/StatusCompleteScreen';
import StatusReason, {
  STATUS_REASON_SCREEN,
} from './containers/StatusReasonScreen';
import { buildTrackedScreen } from './routes/helpers';
import {
  ADD_PERSON_THEN_STEP_SCREEN_FLOW,
  ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW,
  ADD_PERSON_THEN_COMMUNITY_MEMBERS_FLOW,
  EDIT_PERSON_FLOW,
  DEEP_LINK_JOIN_COMMUNITY_AUTHENTENTICATED_FLOW,
  DEEP_LINK_JOIN_COMMUNITY_UNAUTHENTENTICATED_FLOW,
  JOIN_BY_CODE_FLOW,
  JOIN_BY_CODE_ONBOARDING_FLOW,
  ADD_SOMEONE_ONBOARDING_FLOW,
  FULL_ONBOARDING_FLOW,
  GET_STARTED_ONBOARDING_FLOW,
  COMPLETE_STEP_FLOW,
  SIGN_IN_FLOW,
  SIGN_UP_FLOW,
  CREATE_COMMUNITY_UNAUTHENTICATED_FLOW,
  COMPLETE_STEP_FLOW_NAVIGATE_BACK,
  ADD_MY_STEP_FLOW,
  ADD_PERSON_STEP_FLOW,
  SELECT_MY_STAGE_FLOW,
  SELECT_PERSON_STAGE_FLOW,
  ADD_SOMEONE_STEP_FLOW,
  JOURNEY_EDIT_FLOW,
} from './routes/constants';
import {
  AddPersonThenStepScreenFlowNavigator,
  AddPersonThenPeopleScreenFlowNavigator,
  AddPersonThenCommunityMembersFlowNavigator,
} from './routes/addPerson/addPersonFlow';
import { EditPersonFlowNavigator } from './routes/editPerson/editPersonFlow';
import {
  JoinByCodeFlowNavigator,
  JoinByCodeFlowScreens,
} from './routes/groups/joinByCodeFlow';
import {
  JoinByCodeOnboardingFlowNavigator,
  JoinByCodeOnboardingFlowScreens,
} from './routes/onboarding/joinByCodeOnboardingFlow';
import {
  GetStartedOnboardingFlowScreens,
  GetStartedOnboardingFlowNavigator,
} from './routes/onboarding/getStartedOnboardingFlow';
import {
  FullOnboardingFlowScreens,
  FullOnboardingFlowNavigator,
} from './routes/onboarding/fullOnboardingFlow';
import {
  AddSomeoneOnboardingFlowScreens,
  AddSomeoneOnboardingFlowNavigator,
} from './routes/onboarding/addSomeoneOnboardingFlow';
import {
  DeepLinkJoinCommunityAuthenticatedNavigator,
  DeepLinkJoinCommunityAuthenticatedScreens,
} from './routes/deepLink/deepLinkJoinCommunityAuthenticated';
import {
  DeepLinkJoinCommunityUnauthenticatedNavigator,
  DeepLinkJoinCommunityUnauthenticatedScreens,
} from './routes/deepLink/deepLinkJoinCommunityUnauthenticated';
import {
  CompleteStepFlowNavigator,
  CompleteStepFlowAndNavigateBackNavigator,
  CompleteStepFlowScreens,
} from './routes/steps/completeStepFlow';
import { JourneyEditFlowNavigator } from './routes/journey/journeyEditFlow';
import CelebrateDetailScreen, {
  CELEBRATE_DETAIL_SCREEN,
} from './containers/CelebrateDetailScreen';
import { SignInFlowScreens, SignInFlowNavigator } from './routes/auth/signIn';
import { SignUpFlowScreens, SignUpFlowNavigator } from './routes/auth/signUp';
import {
  CreateCommunityUnauthenticatedFlowNavigator,
  CreateCommunityUnauthenticatedFlowScreens,
} from './routes/groups/createCommunityUnauthenticatedFlow';
import { AddMyStepFlowNavigator } from './routes/steps/addMyStepFlow';
import { AddPersonStepFlowNavigator } from './routes/steps/addPersonStepFlow';
import { SelectMyStageFlowNavigator } from './routes/stage/selectMyStageFlow';
import { SelectPersonStageFlowNavigator } from './routes/stage/selectPersonStageFlow';
import TabIcon from './components/TabIcon';
import GroupUnreadFeed, {
  GROUP_UNREAD_FEED_SCREEN,
} from './containers/Groups/GroupUnreadFeed';
import { AddSomeoneStepFlowNavigator } from './routes/addPerson/addSomeoneStepFlow';
import {
  CreatePostScreen,
  CREATE_POST_SCREEN,
} from './containers/Groups/CreatePostScreen';
import LoadingScreen, { LOADING_SCREEN } from './containers/LoadingScreen';
import ChallengeMembers, {
  CHALLENGE_MEMBERS_SCREEN,
} from './containers/ChallengeMembers';
import { CommunitiesRoutes } from './containers/Communities/CommunitiesRoutes';
import NotificationCenterScreen from './containers/NotificationCenterScreen';
import {
  OnboardingAddPhotoScreen,
  ONBOARDING_ADD_PHOTO_SCREEN,
} from './containers/OnboardingAddPhotoScreen';
import CelebrateFeedWithType, {
  CELEBRATE_FEED_WITH_TYPE_SCREEN,
} from './containers/CelebrateFeedWithType';
import AddPostToStepsScreen, {
  ADD_POST_TO_STEPS_SCREEN,
} from './containers/AddPostToStepsScreen';

// Do custom animations between pages
// import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
// const customAnimationFunc = () => ({
//   screenInterpolator: (sceneProps) => {
//     if (
//       sceneProps.index === 0 &&
//       sceneProps.scene.route.routeName !== 'MainNavigator' &&
//       sceneProps.scenes.length > 2
//     ) return null;
//     return CardStackStyleInterpolator.forVertical(sceneProps);
//   },
// });

export const navItem = (name: string) => ({
  tintColor,
}: {
  tintColor: string;
}) => <TabIcon name={name} tintColor={tintColor} />;

const tabs = {
  [PEOPLE_TAB]: {
    screen: PeopleScreen,
    navigationOptions: {
      // @ts-ignore
      tabBarLabel: navItem('people'),
    },
  },
  [STEPS_TAB]: {
    screen: StepsScreen,
    navigationOptions: {
      // @ts-ignore
      tabBarLabel: navItem('steps'),
    },
  },
  [COMMUNITIES_TAB]: {
    screen: GroupsListScreen,
    navigationOptions: {
      // @ts-ignore
      tabBarLabel: navItem('communities'),
    },
  },
  [NOTIFICATIONS_TAB]: {
    screen: NotificationCenterScreen,
    navigationOptions: {
      // @ts-ignore
      tabBarLabel: navItem('notifications'),
    },
  },
};

export const MainTabBar = createBottomTabNavigator(tabs, {
  tabBarOptions: {
    showIcon: false,
    showLabel: true,
    style: {
      backgroundColor: theme.white,
      paddingTop: 4,
    },
    activeTintColor: theme.primaryColor,
    inactiveTintColor: theme.inactiveColor,
    // @ts-ignore
    indicatorStyle: { backgroundColor: 'transparent' },
    upperCaseLabel: false,
    // Android
    scrollEnabled: false,
  },
  // @ts-ignore
  swipeEnabled: false,
  animationEnabled: false,
  lazy: true,
});

export const MAIN_TABS_SCREEN = createDrawerNavigator(
  {
    Main: MainTabBar,
  },
  {
    contentComponent: SettingsMenu,
    backBehavior: 'none', // We're handling it on our own
  },
);

// @ts-ignore
const buildPersonScreenRoute = screen =>
  buildTrackedScreen(
    createDrawerNavigator(
      {
        Main: { screen },
      },
      {
        contentComponent: PersonSideMenu,
        drawerPosition: 'right',
        backBehavior: 'none', // We're handling it on our own
      },
    ),
    // @ts-ignore
    buildTrackingObj('person', 'person'),
    { gesturesEnabled: !isAndroid },
  );

const screens = {
  [SUGGESTED_STEP_DETAIL_SCREEN]: buildTrackedScreen(
    SuggestedStepDetailScreen,
    // @ts-ignore
    buildTrackingObj('mh : people : steps : add : detail', 'people', 'steps'),
  ),
  [ACCEPTED_STEP_DETAIL_SCREEN]: buildTrackedScreen(
    AcceptedStepDetailScreen,
    // @ts-ignore
    buildTrackingObj(
      'mh : people : steps : accepted : detail',
      'people',
      'steps',
    ),
  ),
  [COMPLETED_STEP_DETAIL_SCREEN]: buildTrackedScreen(
    CompletedStepDetailScreen,
    // @ts-ignore
    buildTrackingObj(
      'mh : people : steps : completed : detail',
      'people',
      'steps',
    ),
  ),
  [STEP_REMINDER_SCREEN]: buildTrackedScreen(
    StepReminderScreen,
    // @ts-ignore
    buildTrackingObj('step : detail : reminder', 'step', 'detail'),
  ),
  [ADD_SOMEONE_SCREEN]: buildTrackedScreen(
    AddSomeoneScreen,
    // @ts-ignore
    buildTrackingObj('onboarding : add person', 'onboarding', 'add person'),
  ),
  [ADD_CONTACT_SCREEN]: buildTrackedScreen(
    AddContactScreen,
    // @ts-ignore
    buildTrackingObj('people : add person', 'people', 'add person'),
  ),
  [NOTIFICATION_PRIMER_SCREEN]: buildTrackedScreen(
    NotificationPrimerScreen,
    // @ts-ignore
    buildTrackingObj(
      'menu : notifications : permissions',
      'menu',
      'notifications',
    ),
  ),
  [NOTIFICATION_OFF_SCREEN]: buildTrackedScreen(
    NotificationOffScreen,
    // @ts-ignore
    buildTrackingObj('menu : notifications : off', 'menu', 'notifications'),
  ),
  [SEARCH_SCREEN]: buildTrackedScreen(
    SearchPeopleScreen,
    // @ts-ignore
    buildTrackingObj('search', 'search'),
    { gesturesEnabled: true },
  ),
  [SEARCH_FILTER_SCREEN]: buildTrackedScreen(
    SearchPeopleFilterScreen,
    // @ts-ignore
    buildTrackingObj('search : refine', 'search', 'refine'),
    { gesturesEnabled: true },
  ),
  [GROUPS_REPORT_SCREEN]: buildTrackedScreen(
    GroupReport,
    // @ts-ignore
    buildTrackingObj('communities : report', 'communities', 'report'),
    { gesturesEnabled: true },
  ),
  [GROUP_UNREAD_FEED_SCREEN]: buildTrackedScreen(
    GroupUnreadFeed,
    // @ts-ignore
    buildTrackingObj(
      'communities : comments : unread',
      'communities',
      'comments',
      'unread',
    ),
    { gesturesEnabled: true },
  ),
  [SEARCH_SURVEY_CONTACTS_FILTER_SCREEN]: buildTrackedScreen(
    SurveyContactsFilter,
    // @ts-ignore
    buildTrackingObj(
      'communities : community : survey contacts filer',
      'communities',
      'community',
    ),
    { gesturesEnabled: true },
  ),
  [SEARCH_QUESTIONS_FILTER_SCREEN]: buildTrackedScreen(
    SurveyQuestionsFilter,
    // @ts-ignore
    buildTrackingObj(
      'communities : community : questions filter',
      'communities',
      'community',
    ),
    { gesturesEnabled: true },
  ),
  [SEARCH_CONTACTS_FILTER_SCREEN]: buildTrackedScreen(
    ContactsFilter,
    // @ts-ignore
    buildTrackingObj(
      'communities : community : contacts filter',
      'communities',
      'community',
    ),
    { gesturesEnabled: true },
  ),
  [CREATE_GROUP_SCREEN]: buildTrackedScreen(
    CreateGroupScreen,
    // @ts-ignore
    buildTrackingObj('communities : create', 'communities', 'create'),
    { gesturesEnabled: true },
  ),
  [UNASSIGNED_PERSON_SCREEN]: buildTrackedScreen(
    UnassignedPersonScreen,
    // @ts-ignore
    buildTrackingObj('person : unassigned', 'person'),
    { gesturesEnabled: true },
  ),
  [ONBOARDING_ADD_PHOTO_SCREEN]: OnboardingAddPhotoScreen,
  [CONTACT_PERSON_SCREEN]: buildPersonScreenRoute(ContactPersonScreen),
  [IS_USER_CREATED_MEMBER_PERSON_SCREEN]: buildPersonScreenRoute(
    IsUserCreatedMemberPersonScreen,
  ),
  [IS_GROUPS_MEMBER_PERSON_SCREEN]: buildPersonScreenRoute(
    IsGroupsMemberPersonScreen,
  ),
  [MEMBER_PERSON_SCREEN]: buildPersonScreenRoute(MemberPersonScreen),
  [ME_PERSONAL_PERSON_SCREEN]: buildPersonScreenRoute(MePersonalPersonScreen),
  [IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN]: buildPersonScreenRoute(
    IsGroupsMeCommunityPersonScreen,
  ),
  [ME_COMMUNITY_PERSON_SCREEN]: buildPersonScreenRoute(MeCommunityPersonScreen),
  [MAIN_TABS]: MAIN_TABS_SCREEN,
  [SIGN_IN_FLOW]: SignInFlowNavigator,
  [SIGN_UP_FLOW]: SignUpFlowNavigator,
  [CREATE_COMMUNITY_UNAUTHENTICATED_FLOW]: CreateCommunityUnauthenticatedFlowNavigator,
  [JOIN_BY_CODE_FLOW]: JoinByCodeFlowNavigator,
  [JOIN_BY_CODE_ONBOARDING_FLOW]: JoinByCodeOnboardingFlowNavigator,
  [ADD_SOMEONE_ONBOARDING_FLOW]: AddSomeoneOnboardingFlowNavigator,
  [ADD_SOMEONE_STEP_FLOW]: AddSomeoneStepFlowNavigator,
  [FULL_ONBOARDING_FLOW]: FullOnboardingFlowNavigator,
  [GET_STARTED_ONBOARDING_FLOW]: GetStartedOnboardingFlowNavigator,
  [DEEP_LINK_JOIN_COMMUNITY_AUTHENTENTICATED_FLOW]: DeepLinkJoinCommunityAuthenticatedNavigator,
  [DEEP_LINK_JOIN_COMMUNITY_UNAUTHENTENTICATED_FLOW]: DeepLinkJoinCommunityUnauthenticatedNavigator,
  [COMPLETE_STEP_FLOW]: CompleteStepFlowNavigator,
  [CELEBRATE_DETAIL_SCREEN]: buildTrackedScreen(
    CelebrateDetailScreen,
    // @ts-ignore
    buildTrackingObj(
      'communities : celebration : comment',
      'communities',
      'celebration',
    ),
    { gesturesEnabled: true },
  ),
  [CREATE_POST_SCREEN]: buildTrackedScreen(
    CreatePostScreen,
    // @ts-ignore
    buildTrackingObj(
      'communities : celebration : sharestory',
      'communities',
      'celebration',
    ),
  ),
  [COMPLETE_STEP_FLOW_NAVIGATE_BACK]: CompleteStepFlowAndNavigateBackNavigator,
  [ADD_MY_STEP_FLOW]: AddMyStepFlowNavigator,
  [ADD_PERSON_STEP_FLOW]: AddPersonStepFlowNavigator,
  [SELECT_MY_STAGE_FLOW]: SelectMyStageFlowNavigator,
  [SELECT_PERSON_STAGE_FLOW]: SelectPersonStageFlowNavigator,
  [ADD_PERSON_THEN_STEP_SCREEN_FLOW]: AddPersonThenStepScreenFlowNavigator,
  [ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW]: AddPersonThenPeopleScreenFlowNavigator,
  [ADD_PERSON_THEN_COMMUNITY_MEMBERS_FLOW]: AddPersonThenCommunityMembersFlowNavigator,
  [EDIT_PERSON_FLOW]: EditPersonFlowNavigator,
  [JOURNEY_EDIT_FLOW]: JourneyEditFlowNavigator,
  [LOADING_SCREEN]: LoadingScreen,
  [CHALLENGE_MEMBERS_SCREEN]: ChallengeMembers,
  [CELEBRATE_FEED_WITH_TYPE_SCREEN]: CelebrateFeedWithType,
  [ADD_POST_TO_STEPS_SCREEN]: AddPostToStepsScreen,
};

export const trackableScreens = {
  ...screens,
  ...tabs,
  ...ALL_PERSON_TAB_ROUTES,
  ...JoinByCodeFlowScreens,
  ...JoinByCodeOnboardingFlowScreens,
  ...AddSomeoneOnboardingFlowScreens,
  ...FullOnboardingFlowScreens,
  ...GetStartedOnboardingFlowScreens,
  ...DeepLinkJoinCommunityAuthenticatedScreens,
  ...DeepLinkJoinCommunityUnauthenticatedScreens,
  ...CompleteStepFlowScreens,
  ...CreateCommunityUnauthenticatedFlowScreens,
  ...SignInFlowScreens,
  ...SignUpFlowScreens,
};

const MODAL_SCREENS = [
  CELEBRATE_DETAIL_SCREEN,
  GROUPS_REPORT_SCREEN,
  ADD_POST_TO_STEPS_SCREEN,
];

export const MainStackRoutes = createStackNavigator(
  {
    ...screens,
    ...CommunitiesRoutes,
    [LANDING_SCREEN]: { screen: LandingScreen },
    [CELEBRATION_SCREEN]: { screen: CelebrationScreen },
    [ADD_CHALLENGE_SCREEN]: { screen: AddChallengeScreen },
    [CHALLENGE_DETAIL_SCREEN]: { screen: ChallengeDetailScreen },
    [SELECT_STAGE_SCREEN]: {
      screen: SelectStageScreen,
      // @ts-ignore
      defaultNavigationOptions: { gesturesEnabled: true },
    },
    [SEARCH_REFINE_SCREEN]: {
      screen: SearchPeopleFilterRefineScreen,
      // @ts-ignore
      defaultNavigationOptions: { gesturesEnabled: true },
    },
    [STATUS_SELECT_SCREEN]: {
      screen: StatusSelect,
      // @ts-ignore
      defaultNavigationOptions: { gesturesEnabled: true },
    },
    [STATUS_COMPLETE_SCREEN]: {
      screen: StatusComplete,
      // @ts-ignore
      defaultNavigationOptions: { gesturesEnabled: true },
    },
    [STATUS_REASON_SCREEN]: {
      screen: StatusReason,
      // @ts-ignore
      defaultNavigationOptions: { gesturesEnabled: true },
    },
  },
  {
    initialRouteName: MAIN_TABS,
    defaultNavigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
    // @ts-ignore
    transitionConfig: (transitionProps, prevTransitionProps) =>
      StackViewTransitionConfigs.defaultTransitionConfig(
        transitionProps,
        prevTransitionProps,
        MODAL_SCREENS.some(
          screenName =>
            screenName === transitionProps.scene.route.routeName ||
            (prevTransitionProps &&
              screenName === prevTransitionProps.scene.route.routeName),
        ),
      ),
  },
);

export const MainRoutes = MainStackRoutes;
