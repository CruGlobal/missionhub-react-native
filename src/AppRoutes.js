import React from 'react';
import {
  createBottomTabNavigator,
  createDrawerNavigator,
  createStackNavigator,
} from 'react-navigation';
import i18next from 'i18next';

import LandingScreen, { LANDING_SCREEN } from './containers/LandingScreen';
import KeyLoginScreen, { KEY_LOGIN_SCREEN } from './containers/KeyLoginScreen';
import StepsScreen from './containers/StepsScreen';
import PeopleScreen from './containers/PeopleScreen';
import SelectMyStepScreen, {
  SELECT_MY_STEP_ONBOARDING_SCREEN,
  SELECT_MY_STEP_SCREEN,
} from './containers/SelectMyStepScreen';
import PersonSelectStepScreen, {
  PERSON_SELECT_STEP_SCREEN,
} from './containers/PersonSelectStepScreen';
import AddStepScreen, { ADD_STEP_SCREEN } from './containers/AddStepScreen';
import AddChallengeScreen, {
  ADD_CHALLENGE_SCREEN,
} from './containers/AddChallengeScreen';
import ChallengeDetailScreen, {
  CHALLENGE_DETAIL_SCREEN,
} from './containers/ChallengeDetailScreen';
import WelcomeScreen, { WELCOME_SCREEN } from './containers/WelcomeScreen';
import SetupScreen, { SETUP_SCREEN } from './containers/SetupScreen';
import GetStartedScreen, {
  GET_STARTED_SCREEN,
} from './containers/GetStartedScreen';
import StageScreen, {
  STAGE_ONBOARDING_SCREEN,
  STAGE_SCREEN,
} from './containers/StageScreen';
import StageSuccessScreen, {
  STAGE_SUCCESS_SCREEN,
} from './containers/StageSuccessScreen';
import AddSomeoneScreen, {
  ADD_SOMEONE_SCREEN,
} from './containers/AddSomeoneScreen';
import AddContactScreen, {
  ADD_CONTACT_SCREEN,
} from './containers/AddContactScreen';
import NotificationPrimerScreen, {
  NOTIFICATION_PRIMER_SCREEN,
} from './containers/NotificationPrimerScreen';
import SetupPersonScreen, {
  SETUP_PERSON_SCREEN,
} from './containers/SetupPersonScreen';
import PersonStageScreen, {
  PERSON_STAGE_SCREEN,
} from './containers/PersonStageScreen';
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
import UpgradeAccountScreen, {
  UPGRADE_ACCOUNT_SCREEN,
} from './containers/UpgradeAccountScreen';
import NotificationOffScreen, {
  NOTIFICATION_OFF_SCREEN,
} from './containers/NotificationOffScreen';
import MFACodeScreen, { MFA_CODE_SCREEN } from './containers/MFACodeScreen';
import {
  ALL_PERSON_TAB_ROUTES,
  CONTACT_PERSON_SCREEN,
  ContactPersonScreen,
  IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN,
  IS_GROUPS_MEMBER_PERSON_SCREEN,
  IS_USER_CREATED_MEMBER_PERSON_SCREEN,
  IsGroupsMeCommunityPersonScreen,
  IsGroupsMemberPersonScreen,
  IsUserCreatedMemberPersonScreen,
  ME_COMMUNITY_PERSON_SCREEN,
  ME_PERSONAL_PERSON_SCREEN,
  MeCommunityPersonScreen,
  MEMBER_PERSON_SCREEN,
  MemberPersonScreen,
  MePersonalPersonScreen,
} from './containers/Groups/AssignedPersonScreen';
import SettingsMenu from './components/SettingsMenu';
import PersonSideMenu from './components/PersonSideMenu';
import { Flex, Icon, Text } from './components/common';
import theme from './theme';
import MainTabs from './containers/MainTabs';
import { MAIN_TABS, PEOPLE_TAB, STEPS_TAB, GROUPS_TAB } from './constants';
import { buildTrackingObj, isAndroid } from './utils/common';
import GroupsListScreen from './containers/Groups/GroupsListScreen';
import {
  groupScreenTabNavigator,
  userCreatedScreenTabNavigator,
  globalScreenTabNavigator,
  GROUP_SCREEN,
  USER_CREATED_GROUP_SCREEN,
  GLOBAL_GROUP_SCREEN,
  GROUP_TABS,
} from './containers/Groups/GroupScreen';
import SurveyContacts, {
  GROUPS_SURVEY_CONTACTS,
} from './containers/Groups/SurveyContacts';
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
import GroupProfile, { GROUP_PROFILE } from './containers/Groups/GroupProfile';
import { buildTrackedScreen, wrapNextScreen } from './routes/helpers';
import {
  DEEP_LINK_JOIN_COMMUNITY_AUTHENTENTICATED_FLOW,
  DEEP_LINK_JOIN_COMMUNITY_UNAUTHENTENTICATED_FLOW,
  JOIN_BY_CODE_FLOW,
  JOIN_BY_CODE_ONBOARDING_FLOW,
  COMPLETE_STEP_FLOW,
} from './routes/constants';
import {
  JoinByCodeFlowNavigator,
  JoinByCodeFlowScreens,
} from './routes/groups/joinByCodeFlow';
import {
  JoinByCodeOnboardingFlowNavigator,
  JoinByCodeOnboardingFlowScreens,
} from './routes/onboarding/joinByCodeOnboardingFlow';
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
  CompleteStepFlowScreens,
} from './routes/steps/completeStepFlow';

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

export const navItem = name => ({ tintColor }) => (
  <Flex value={1} align="center" justify="center">
    <Icon
      type="MissionHub"
      name={`${name}Icon`}
      size={isAndroid ? 22 : 24}
      style={{ color: tintColor }}
    />
    <Text style={{ color: tintColor, fontSize: 14 }}>
      {i18next.t(`appRoutes:${name}`)}
    </Text>
  </Flex>
);

export const stepsTab = buildTrackingObj('steps', 'steps');
const tabs = {
  [STEPS_TAB]: buildTrackedScreen(StepsScreen, stepsTab, {
    tabBarLabel: navItem('steps'),
  }),
  [PEOPLE_TAB]: buildTrackedScreen(
    PeopleScreen,
    buildTrackingObj('people', 'people'),
    {
      tabBarLabel: navItem('people'),
    },
  ),
  [GROUPS_TAB]: buildTrackedScreen(
    GroupsListScreen,
    buildTrackingObj('communities', 'communities'),
    {
      tabBarLabel: navItem('groups'),
    },
  ),
};

const createTabs = initialRouteName => {
  return createBottomTabNavigator(tabs, {
    tabBarOptions: {
      showIcon: false,
      showLabel: true,
      style: {
        backgroundColor: theme.white,
        paddingTop: 4,
      },
      activeTintColor: theme.primaryColor,
      inactiveTintColor: theme.inactiveColor,
      indicatorStyle: { backgroundColor: 'transparent' },
      upperCaseLabel: false,

      // Android
      scrollEnabled: false,
    },
    swipeEnabled: false,
    animationEnabled: false,
    lazy: true,
    paths: {
      [STEPS_TAB]: '/steps',
      [PEOPLE_TAB]: '/people',
      [GROUPS_TAB]: '/groups',
    },
    initialRouteName,
  });
};

export const MainTabBarStartSteps = createTabs(STEPS_TAB);
// Create another set of tabs with a different default tab
export const MainTabBarStartGroups = createTabs(GROUPS_TAB);

export const MAIN_TABS_SCREEN = buildTrackedScreen(
  createDrawerNavigator(
    {
      Main: { screen: MainTabs },
    },
    {
      contentComponent: SettingsMenu,
      navigationOptions: { drawerLockMode: 'locked-closed' },
      backBehavior: 'none', // We're handling it on our own
    },
  ),
  stepsTab, //stepsTab is shown when MainTabs first opens
);

const buildPersonScreenRoute = screen =>
  buildTrackedScreen(
    createDrawerNavigator(
      {
        Main: { screen },
      },
      {
        contentComponent: PersonSideMenu,
        drawerPosition: 'right',
        navigationOptions: { drawerLockMode: 'locked-closed' },
        backBehavior: 'none', // We're handling it on our own
      },
    ),
    buildTrackingObj('person', 'person'),
    { gesturesEnabled: isAndroid ? false : true },
  );

const screens = {
  [UPGRADE_ACCOUNT_SCREEN]: buildTrackedScreen(
    UpgradeAccountScreen,
    buildTrackingObj('auth', 'auth'),
  ),
  [KEY_LOGIN_SCREEN]: buildTrackedScreen(
    KeyLoginScreen,
    buildTrackingObj('auth : sign in', 'auth'),
    { gesturesEnabled: true },
  ),
  [MFA_CODE_SCREEN]: buildTrackedScreen(
    MFACodeScreen,
    buildTrackingObj('auth : verification', 'auth'),
  ),
  [WELCOME_SCREEN]: buildTrackedScreen(
    wrapNextScreen(WelcomeScreen, SETUP_SCREEN),
    buildTrackingObj('onboarding : welcome', 'onboarding'),
  ),
  [SETUP_SCREEN]: buildTrackedScreen(
    wrapNextScreen(SetupScreen, GET_STARTED_SCREEN),
    buildTrackingObj('onboarding : name', 'onboarding'),
  ),
  [GET_STARTED_SCREEN]: buildTrackedScreen(
    GetStartedScreen,
    buildTrackingObj('onboarding : get started', 'onboarding'),
  ),
  [STAGE_SUCCESS_SCREEN]: buildTrackedScreen(
    StageSuccessScreen,
    buildTrackingObj(
      'onboarding : self : choose my steps',
      'onboarding',
      'self',
    ),
  ),
  [SELECT_MY_STEP_SCREEN]: buildTrackedScreen(
    SelectMyStepScreen,
    buildTrackingObj('people : self : steps : add', 'people', 'self', 'steps'),
  ),
  [SELECT_MY_STEP_ONBOARDING_SCREEN]: buildTrackedScreen(
    SelectMyStepScreen,
    buildTrackingObj(
      'onboarding : self : steps : add',
      'onboarding',
      'self',
      'steps',
    ),
  ),
  [ADD_SOMEONE_SCREEN]: buildTrackedScreen(
    AddSomeoneScreen,
    buildTrackingObj('onboarding : add person', 'onboarding', 'add person'),
  ),
  [ADD_CONTACT_SCREEN]: buildTrackedScreen(
    AddContactScreen,
    buildTrackingObj('people : add person', 'people', 'add person'),
  ),
  [SETUP_PERSON_SCREEN]: buildTrackedScreen(
    SetupPersonScreen,
    buildTrackingObj(
      'onboarding : add person : name',
      'onboarding',
      'add person',
    ),
  ),
  [NOTIFICATION_PRIMER_SCREEN]: buildTrackedScreen(
    NotificationPrimerScreen,
    buildTrackingObj(
      'menu : notifications : permissions',
      'menu',
      'notifications',
    ),
  ),
  [NOTIFICATION_OFF_SCREEN]: buildTrackedScreen(
    NotificationOffScreen,
    buildTrackingObj('menu : notifications : off', 'menu', 'notifications'),
  ),
  [SEARCH_SCREEN]: buildTrackedScreen(
    SearchPeopleScreen,
    buildTrackingObj('search', 'search'),
    { gesturesEnabled: true },
  ),
  [SEARCH_FILTER_SCREEN]: buildTrackedScreen(
    SearchPeopleFilterScreen,
    buildTrackingObj('search : refine', 'search', 'refine'),
    { gesturesEnabled: true },
  ),
  [GROUP_SCREEN]: buildTrackedScreen(
    groupScreenTabNavigator,
    buildTrackingObj('communities : community', 'communities', 'community'),
  ),
  [USER_CREATED_GROUP_SCREEN]: buildTrackedScreen(
    userCreatedScreenTabNavigator,
    buildTrackingObj('communities : community', 'communities', 'community'),
  ),
  [GLOBAL_GROUP_SCREEN]: buildTrackedScreen(
    globalScreenTabNavigator,
    buildTrackingObj(
      'communities : global community',
      'communities',
      'global community',
    ),
  ),
  [GROUPS_SURVEY_CONTACTS]: buildTrackedScreen(
    SurveyContacts,
    buildTrackingObj(
      'communities : surveys : respondants',
      'communities',
      'surveys',
      'respondants',
    ),
    { gesturesEnabled: true },
  ),
  [SEARCH_SURVEY_CONTACTS_FILTER_SCREEN]: buildTrackedScreen(
    SurveyContactsFilter,
    buildTrackingObj(
      'communities : community : survey contacts filer',
      'communities',
      'community',
    ),
    { gesturesEnabled: true },
  ),
  [SEARCH_QUESTIONS_FILTER_SCREEN]: buildTrackedScreen(
    SurveyQuestionsFilter,
    buildTrackingObj(
      'communities : community : questions filter',
      'communities',
      'community',
    ),
    { gesturesEnabled: true },
  ),
  [SEARCH_CONTACTS_FILTER_SCREEN]: buildTrackedScreen(
    ContactsFilter,
    buildTrackingObj(
      'communities : community : contacts filter',
      'communities',
      'community',
    ),
    { gesturesEnabled: true },
  ),
  [CREATE_GROUP_SCREEN]: buildTrackedScreen(
    CreateGroupScreen,
    buildTrackingObj('communities : create', 'communities', 'create'),
    { gesturesEnabled: true },
  ),
  [UNASSIGNED_PERSON_SCREEN]: buildTrackedScreen(
    UnassignedPersonScreen,
    buildTrackingObj('person : unassigned', 'person'),
    { gesturesEnabled: true },
  ),
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
  [JOIN_BY_CODE_FLOW]: JoinByCodeFlowNavigator,
  [JOIN_BY_CODE_ONBOARDING_FLOW]: JoinByCodeOnboardingFlowNavigator,
  [DEEP_LINK_JOIN_COMMUNITY_AUTHENTENTICATED_FLOW]: DeepLinkJoinCommunityAuthenticatedNavigator,
  [DEEP_LINK_JOIN_COMMUNITY_UNAUTHENTENTICATED_FLOW]: DeepLinkJoinCommunityUnauthenticatedNavigator,
  [COMPLETE_STEP_FLOW]: CompleteStepFlowNavigator,
};

export const trackableScreens = {
  ...screens,
  ...tabs,
  ...GROUP_TABS,
  ...ALL_PERSON_TAB_ROUTES,
  ...JoinByCodeFlowScreens,
  ...JoinByCodeOnboardingFlowScreens,
  ...DeepLinkJoinCommunityAuthenticatedScreens,
  ...DeepLinkJoinCommunityUnauthenticatedScreens,
  ...CompleteStepFlowScreens,
};

export const MainStackRoutes = createStackNavigator(
  {
    ...screens,
    [LANDING_SCREEN]: { screen: LandingScreen },
    [STAGE_ONBOARDING_SCREEN]: { screen: StageScreen },
    [PERSON_SELECT_STEP_SCREEN]: {
      screen: PersonSelectStepScreen,
      navigationOptions: { gesturesEnabled: true },
    },
    [SELECT_MY_STEP_SCREEN]: {
      screen: SelectMyStepScreen,
      navigationOptions: { gesturesEnabled: true },
    },
    [CELEBRATION_SCREEN]: { screen: CelebrationScreen },
    [ADD_STEP_SCREEN]: { screen: AddStepScreen },
    [ADD_CHALLENGE_SCREEN]: { screen: AddChallengeScreen },
    [CHALLENGE_DETAIL_SCREEN]: { screen: ChallengeDetailScreen },
    [PERSON_STAGE_SCREEN]: {
      screen: PersonStageScreen,
      navigationOptions: { gesturesEnabled: true },
    },
    [STAGE_SCREEN]: {
      screen: StageScreen,
      navigationOptions: { gesturesEnabled: true },
    },
    [SEARCH_REFINE_SCREEN]: {
      screen: SearchPeopleFilterRefineScreen,
      navigationOptions: { gesturesEnabled: true },
    },
    [STATUS_SELECT_SCREEN]: {
      screen: StatusSelect,
      navigationOptions: { gesturesEnabled: true },
    },
    [STATUS_COMPLETE_SCREEN]: {
      screen: StatusComplete,
      navigationOptions: { gesturesEnabled: true },
    },
    [STATUS_REASON_SCREEN]: {
      screen: StatusReason,
      navigationOptions: { gesturesEnabled: true },
    },
    [GROUP_PROFILE]: { screen: GroupProfile },
  },
  {
    initialRouteName: MAIN_TABS,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
);

export const MainRoutes = MainStackRoutes;
