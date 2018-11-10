import React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator,
} from 'react-navigation';
import i18next from 'i18next';
import createSwitchNavigator from 'react-navigation/src/navigators/createSwitchNavigator';

import StepsScreen from '../containers/StepsScreen';
import PeopleScreen from '../containers/PeopleScreen';
import AddChallengeScreen, {
  ADD_CHALLENGE_SCREEN,
} from '../containers/AddChallengeScreen';
import StageScreen, { STAGE_SCREEN } from '../containers/StageScreen';
import AddContactScreen, {
  ADD_CONTACT_SCREEN,
} from '../containers/AddContactScreen';
import ImpactScreen from '../containers/ImpactScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../containers/CelebrationScreen';
import SearchPeopleScreen, {
  SEARCH_SCREEN,
} from '../containers/SearchPeopleScreen';
import SearchPeopleFilterScreen, {
  SEARCH_FILTER_SCREEN,
} from '../containers/SearchPeopleFilterScreen';
import SearchPeopleFilterRefineScreen, {
  SEARCH_REFINE_SCREEN,
} from '../containers/SearchPeopleFilterRefineScreen';
import {
  ContactPersonScreen,
  IsUserCreatedMemberPersonScreen,
  IsGroupsMemberPersonScreen,
  MemberPersonScreen,
  MePersonalPersonScreen,
  IsGroupsMeCommunityPersonScreen,
  MeCommunityPersonScreen,
  CONTACT_PERSON_SCREEN,
  IS_USER_CREATED_MEMBER_PERSON_SCREEN,
  IS_GROUPS_MEMBER_PERSON_SCREEN,
  MEMBER_PERSON_SCREEN,
  ME_PERSONAL_PERSON_SCREEN,
  IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN,
  ME_COMMUNITY_PERSON_SCREEN,
  ALL_PERSON_TAB_ROUTES,
} from '../containers/Groups/AssignedPersonScreen';
import SettingsMenu from '../components/SettingsMenu';
import PersonSideMenu from '../components/PersonSideMenu';
import { Flex, Icon, Text } from '../components/common';
import theme from '../theme';
import MainTabs from '../containers/MainTabs';
import {
  IMPACT_TAB,
  MAIN_TABS,
  PEOPLE_TAB,
  STEPS_TAB,
  GROUPS_TAB,
} from '../constants';
import { buildTrackingObj, isAndroid } from '../utils/common';
import GroupsListScreen from '../containers/Groups/GroupsListScreen';
import {
  groupScreenTabNavigator,
  userCreatedScreenTabNavigator,
  GROUP_SCREEN,
  USER_CREATED_GROUP_SCREEN,
  GROUP_TABS,
} from '../containers/Groups/GroupScreen';
import SurveyContacts, {
  GROUPS_SURVEY_CONTACTS,
} from '../containers/Groups/SurveyContacts';
import UnassignedPersonScreen, {
  UNASSIGNED_PERSON_SCREEN,
} from '../containers/Groups/UnassignedPersonScreen';
import SurveyContactsFilter, {
  SEARCH_SURVEY_CONTACTS_FILTER_SCREEN,
} from '../containers/Groups/SurveyContactsFilter';
import SurveyQuestionsFilter, {
  SEARCH_QUESTIONS_FILTER_SCREEN,
} from '../containers/Groups/SurveyQuestionsFilter';
import ContactsFilter, {
  SEARCH_CONTACTS_FILTER_SCREEN,
} from '../containers/Groups/ContactsFilter';
import StatusSelect, {
  STATUS_SELECT_SCREEN,
} from '../containers/StatusSelectScreen';
import StatusComplete, {
  STATUS_COMPLETE_SCREEN,
} from '../containers/StatusCompleteScreen';
import StatusReason, {
  STATUS_REASON_SCREEN,
} from '../containers/StatusReasonScreen';

import {
  AUTHENTICATION_FLOW,
  AuthenticationNavigator,
  AuthenticationScreens,
} from './authentication';
import {
  ONBOARDING_FLOW,
  OnboardingNavigator,
  OnboardingScreens,
} from './onboarding';
import { NOTIFICATION_OFF_SCREEN } from '../containers/NotificationOffScreen';
import NotificationOffScreen from '../containers/NotificationOffScreen';

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

const buildTrackedScreen = (screen, tracking, navOptions) => {
  return {
    screen: screen,
    tracking: tracking,
    navigationOptions: navOptions,
  };
};

export const stepsTab = buildTrackingObj(['steps']);
const tabs = {
  [STEPS_TAB]: buildTrackedScreen(StepsScreen, stepsTab, {
    tabBarLabel: navItem('steps'),
  }),
  [PEOPLE_TAB]: buildTrackedScreen(PeopleScreen, buildTrackingObj(['people']), {
    tabBarLabel: navItem('people'),
  }),
  [IMPACT_TAB]: buildTrackedScreen(ImpactScreen, buildTrackingObj(['impact']), {
    tabBarLabel: navItem('impact'),
  }),
  [GROUPS_TAB]: buildTrackedScreen(
    GroupsListScreen,
    buildTrackingObj(['groups']),
    {
      tabBarLabel: navItem('groups'),
    },
  ),
};

const createTabs = (tabKey, tabPath) => {
  return createBottomTabNavigator(
    {
      StepsTab: tabs.StepsTab,
      PeopleTab: tabs.PeopleTab,
      [tabKey]: tabs[tabKey],
    },
    {
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
        StepsTab: '/steps',
        PeopleTab: '/people',
        [tabKey]: tabPath,
      },
    },
  );
};

export const MainTabBar = createTabs(IMPACT_TAB, '/impact');

export const MainTabBarGroups = createTabs(GROUPS_TAB, '/groups');

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
    buildTrackingObj(['person']),
    { gesturesEnabled: isAndroid ? false : true },
  );

const screens = {
  [SEARCH_SCREEN]: buildTrackedScreen(
    SearchPeopleScreen,
    buildTrackingObj(['search']),
    { gesturesEnabled: true },
  ),
  [SEARCH_FILTER_SCREEN]: buildTrackedScreen(
    SearchPeopleFilterScreen,
    buildTrackingObj(['search', 'refine']),
    { gesturesEnabled: true },
  ),
  [GROUP_SCREEN]: buildTrackedScreen(
    groupScreenTabNavigator,
    buildTrackingObj(['communities', 'community']),
  ),
  [USER_CREATED_GROUP_SCREEN]: buildTrackedScreen(
    userCreatedScreenTabNavigator,
    buildTrackingObj(['communities', 'community']),
  ),
  [GROUPS_SURVEY_CONTACTS]: buildTrackedScreen(
    SurveyContacts,
    buildTrackingObj(['communities', 'community'], 'survey contacts'),
    {
      gesturesEnabled: true,
    },
  ),
  [SEARCH_SURVEY_CONTACTS_FILTER_SCREEN]: buildTrackedScreen(
    SurveyContactsFilter,
    buildTrackingObj(['communities', 'community'], 'survey contacts filer'),
    { gesturesEnabled: true },
  ),
  [SEARCH_QUESTIONS_FILTER_SCREEN]: buildTrackedScreen(
    SurveyQuestionsFilter,
    buildTrackingObj(['communities', 'community'], 'questions filter'),
    {
      gesturesEnabled: true,
    },
  ),
  [SEARCH_CONTACTS_FILTER_SCREEN]: buildTrackedScreen(
    ContactsFilter,
    buildTrackingObj(['communities', 'community'], 'contacts filter'),
    {
      gesturesEnabled: true,
    },
  ),
  [UNASSIGNED_PERSON_SCREEN]: buildTrackedScreen(
    UnassignedPersonScreen,
    buildTrackingObj(['person'], 'unassigned'),
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
};

// export const trackableScreens = {
//   ...screens,
//   ...tabs,
//   ...GROUP_TABS,
//   ...ALL_PERSON_TAB_ROUTES,
//   ...AuthenticationScreens,
//   ...OnboardingScreens,
// };

const MainStackRoutes = createStackNavigator(
  {
    ...screens,
    [ADD_CONTACT_SCREEN]: {
      screen: AddContactScreen,
      tracking: buildTrackingObj(['people'], 'add person'),
    },
    [NOTIFICATION_OFF_SCREEN]: {
      screen: NotificationOffScreen,
      tracking: buildTrackingObj(['menu', 'notifications'], 'off'),
    },
    [CELEBRATION_SCREEN]: { screen: CelebrationScreen },
    [ADD_CHALLENGE_SCREEN]: { screen: AddChallengeScreen },
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
  },
  {
    initialRouteName: MAIN_TABS,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
);

export const trackableScreens = {
  [AUTHENTICATION_FLOW]: AuthenticationScreens,
  [ONBOARDING_FLOW]: OnboardingScreens,
  [MAIN_TABS]: 'something',
};

export const AppNavigator = createSwitchNavigator({
  [AUTHENTICATION_FLOW]: AuthenticationNavigator,
  [ONBOARDING_FLOW]: OnboardingNavigator,
  [MAIN_TABS]: MAIN_TABS_SCREEN,
});
