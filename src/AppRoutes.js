import React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator,
} from 'react-navigation';
import i18next from 'i18next';

import LoginScreen, { LOGIN_SCREEN } from './containers/LoginScreen';
import KeyLoginScreen, { KEY_LOGIN_SCREEN } from './containers/KeyLoginScreen';
import StepsScreen from './containers/StepsScreen';
import PeopleScreen from './containers/PeopleScreen';
import SelectMyStepScreen, {
  SELECT_MY_STEP_SCREEN,
  SELECT_MY_STEP_ONBOARDING_SCREEN,
} from './containers/SelectMyStepScreen';
import PersonSelectStepScreen, {
  PERSON_SELECT_STEP_SCREEN,
} from './containers/PersonSelectStepScreen';
import AddStepScreen, { ADD_STEP_SCREEN } from './containers/AddStepScreen';
import WelcomeScreen, { WELCOME_SCREEN } from './containers/WelcomeScreen';
import SetupScreen, { SETUP_SCREEN } from './containers/SetupScreen';
import GetStartedScreen, {
  GET_STARTED_SCREEN,
} from './containers/GetStartedScreen';
import StageScreen, {
  STAGE_SCREEN,
  STAGE_ONBOARDING_SCREEN,
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
import ImpactScreen from './containers/ImpactScreen';
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
import LoginOptionsScreen, {
  LOGIN_OPTIONS_SCREEN,
} from './containers/LoginOptionsScreen';
import NotificationOffScreen, {
  NOTIFICATION_OFF_SCREEN,
} from './containers/NotificationOffScreen';
import MFACodeScreen, { MFA_CODE_SCREEN } from './containers/MFACodeScreen';
import {
  ContactPersonScreen,
  IsGroupsMemberPersonScreen,
  MemberPersonScreen,
  MePersonalPersonScreen,
  IsGroupsMeCommunityPersonScreen,
  MeCommunityPersonScreen,
  CONTACT_PERSON_SCREEN,
  IS_GROUPS_MEMBER_PERSON_SCREEN,
  MEMBER_PERSON_SCREEN,
  ME_PERSONAL_PERSON_SCREEN,
  IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN,
  ME_COMMUNITY_PERSON_SCREEN,
} from './containers/Groups/AssignedPersonScreen';
import SettingsMenu from './components/SettingsMenu';
import PersonSideMenu from './components/PersonSideMenu';
import { Flex, Icon, Text } from './components/common';
import theme from './theme';
import MainTabs from './containers/MainTabs';
import {
  IMPACT_TAB,
  MAIN_TABS,
  PEOPLE_TAB,
  STEPS_TAB,
  GROUPS_TAB,
} from './constants';
import { buildTrackingObj, isAndroid } from './utils/common';
import GroupsListScreen from './containers/Groups/GroupsListScreen';
import {
  groupScreenTabNavigator,
  GROUP_SCREEN,
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
import ContactsFilter, {
  SEARCH_CONTACTS_FILTER_SCREEN,
} from './containers/Groups/ContactsFilter';
import StatusSelect, {
  STATUS_SELECT_SCREEN,
} from './containers/StatusSelectScreen';
import StatusComplete, {
  STATUS_COMPLETE_SCREEN,
} from './containers/StatusCompleteScreen';
import StatusReason, {
  STATUS_REASON_SCREEN,
} from './containers/StatusReasonScreen';

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
  [IMPACT_TAB]: buildTrackedScreen(
    ImpactScreen,
    buildTrackingObj('impact', 'impact'),
    {
      tabBarLabel: navItem('impact'),
    },
  ),
  [GROUPS_TAB]: buildTrackedScreen(
    GroupsListScreen,
    buildTrackingObj('groups', 'groups'),
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

const screens = {
  [LOGIN_OPTIONS_SCREEN]: buildTrackedScreen(
    LoginOptionsScreen,
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
    WelcomeScreen,
    buildTrackingObj('onboarding : welcome', 'onboarding'),
  ),
  [SETUP_SCREEN]: buildTrackedScreen(
    SetupScreen,
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
  [GROUP_SCREEN]: { screen: groupScreenTabNavigator },
  [MAIN_TABS]: MAIN_TABS_SCREEN,
};

export const trackableScreens = {
  ...screens,
  ...tabs,
};

export const MainStackRoutes = createStackNavigator(
  {
    ...screens,
    [LOGIN_SCREEN]: { screen: LoginScreen },
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
    [GROUPS_SURVEY_CONTACTS]: {
      screen: SurveyContacts,
      navigationOptions: { gesturesEnabled: true },
    },
    [SEARCH_SURVEY_CONTACTS_FILTER_SCREEN]: {
      screen: SurveyContactsFilter,
      navigationOptions: { gesturesEnabled: true },
    },
    [SEARCH_CONTACTS_FILTER_SCREEN]: {
      screen: ContactsFilter,
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
    [UNASSIGNED_PERSON_SCREEN]: {
      screen: UnassignedPersonScreen,
      navigationOptions: { gesturesEnabled: true },
    },
    [CONTACT_PERSON_SCREEN]: {
      screen: createDrawerNavigator(
        {
          Main: { screen: ContactPersonScreen },
        },
        {
          contentComponent: PersonSideMenu,
          drawerPosition: 'right',
          navigationOptions: { drawerLockMode: 'locked-closed' },
          backBehavior: 'none', // We're handling it on our own
        },
      ),
      navigationOptions: { gesturesEnabled: isAndroid ? false : true },
    },
    [IS_GROUPS_MEMBER_PERSON_SCREEN]: {
      screen: createDrawerNavigator(
        {
          Main: { screen: IsGroupsMemberPersonScreen },
        },
        {
          contentComponent: PersonSideMenu,
          drawerPosition: 'right',
          navigationOptions: { drawerLockMode: 'locked-closed' },
          backBehavior: 'none', // We're handling it on our own
        },
      ),
      navigationOptions: { gesturesEnabled: isAndroid ? false : true },
    },
    [MEMBER_PERSON_SCREEN]: {
      screen: createDrawerNavigator(
        {
          Main: { screen: MemberPersonScreen },
        },
        {
          contentComponent: PersonSideMenu,
          drawerPosition: 'right',
          navigationOptions: { drawerLockMode: 'locked-closed' },
          backBehavior: 'none', // We're handling it on our own
        },
      ),
      navigationOptions: { gesturesEnabled: isAndroid ? false : true },
    },
    [ME_PERSONAL_PERSON_SCREEN]: {
      screen: createDrawerNavigator(
        {
          Main: { screen: MePersonalPersonScreen },
        },
        {
          contentComponent: PersonSideMenu,
          drawerPosition: 'right',
          navigationOptions: { drawerLockMode: 'locked-closed' },
          backBehavior: 'none', // We're handling it on our own
        },
      ),
      navigationOptions: { gesturesEnabled: isAndroid ? false : true },
    },
    [IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN]: {
      screen: createDrawerNavigator(
        {
          Main: { screen: IsGroupsMeCommunityPersonScreen },
        },
        {
          contentComponent: PersonSideMenu,
          drawerPosition: 'right',
          navigationOptions: { drawerLockMode: 'locked-closed' },
          backBehavior: 'none', // We're handling it on our own
        },
      ),
      navigationOptions: { gesturesEnabled: isAndroid ? false : true },
    },
    [ME_COMMUNITY_PERSON_SCREEN]: {
      screen: createDrawerNavigator(
        {
          Main: { screen: MeCommunityPersonScreen },
        },
        {
          contentComponent: PersonSideMenu,
          drawerPosition: 'right',
          navigationOptions: { drawerLockMode: 'locked-closed' },
          backBehavior: 'none', // We're handling it on our own
        },
      ),
      navigationOptions: { gesturesEnabled: isAndroid ? false : true },
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

export const MainRoutes = MainStackRoutes;
