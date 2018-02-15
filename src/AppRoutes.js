import React from 'react';
import { Platform } from 'react-native';
import { StackNavigator, TabNavigator, DrawerNavigator } from 'react-navigation';
import i18next from 'i18next';

import LoginScreen, { LOGIN_SCREEN } from './containers/LoginScreen';
import KeyLoginScreen, { KEY_LOGIN_SCREEN } from './containers/KeyLoginScreen';
import StepsScreen from './containers/StepsScreen';
import PeopleScreen from './containers/PeopleScreen';
import SelectMyStepScreen, { SELECT_MY_STEP_SCREEN, SELECT_MY_STEP_ONBOARDING_SCREEN } from './containers/SelectMyStepScreen';
import PersonSelectStepScreen, { PERSON_SELECT_STEP_SCREEN } from './containers/PersonSelectStepScreen';
import AddStepScreen, { ADD_STEP_SCREEN } from './containers/AddStepScreen';
import ProfileScreen from './containers/ProfileScreen';
import WelcomeScreen, { WELCOME_SCREEN } from './containers/WelcomeScreen';
import SetupScreen, { SETUP_SCREEN } from './containers/SetupScreen';
import GetStartedScreen, { GET_STARTED_SCREEN } from './containers/GetStartedScreen';
import StageScreen, { STAGE_SCREEN, STAGE_ONBOARDING_SCREEN } from './containers/StageScreen';
import StageSuccessScreen, { STAGE_SUCCESS_SCREEN } from './containers/StageSuccessScreen';
import AddSomeoneScreen, { ADD_SOMEONE_SCREEN } from './containers/AddSomeoneScreen';
import ContactScreen, { CONTACT_SCREEN } from './containers/ContactScreen';
import AddContactScreen, { ADD_CONTACT_SCREEN } from './containers/AddContactScreen';
import NotificationPrimerScreen, { NOTIFICATION_PRIMER_SCREEN } from './containers/NotificationPrimerScreen';
import ImpactScreen from './containers/ImpactScreen';
import SetupPersonScreen, { SETUP_PERSON_SCREEN } from './containers/SetupPersonScreen';
import PersonStageScreen, { PERSON_STAGE_SCREEN } from './containers/PersonStageScreen';
import CelebrationScreen, { CELEBRATION_SCREEN } from './containers/CelebrationScreen';
import SearchPeopleScreen, { SEARCH_SCREEN } from './containers/SearchPeopleScreen';
import SearchPeopleFilterScreen, { SEARCH_FILTER_SCREEN } from './containers/SearchPeopleFilterScreen';
import SearchPeopleFilterRefineScreen, { SEARCH_REFINE_SCREEN } from './containers/SearchPeopleFilterRefineScreen';
import LoginOptionsScreen, { LOGIN_OPTIONS_SCREEN } from './containers/LoginOptionsScreen';
import NotificationOffScreen, { NOTIFICATION_OFF_SCREEN } from './containers/NotificationOffScreen';

import SettingsMenu from './components/SettingsMenu';
import ContactSideMenu from './components/ContactSideMenu';
import { Icon } from './components/common';

import theme from './theme';
import { MAIN_TABS } from './constants';
import { buildTrackingObj } from './utils/common';

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

const navIcon = (name) => ({ tintColor }) => <Icon type="MissionHub" name={name} size={24} style={{ color: tintColor }} />;

function labelStyle() {
  if (Platform.OS === 'android') {
    return { marginTop: 5, marginBottom: -5 };
  } else {
    return {};
  }
}

const buildTrackedScreen = (screen, tracking, navOptions) => {
  return {
    screen: screen,
    tracking: tracking,
    navigationOptions: navOptions,
  };
};

const stepsTab = buildTrackingObj('steps : steps', 'steps');
const tabs = {
  StepsTab: buildTrackedScreen(
    StepsScreen,
    stepsTab,
    {
      tabBarLabel: i18next.t('appRoutes:steps'),
      tabBarIcon: navIcon('stepsIcon'),
    },
  ),
  PeopleTab: buildTrackedScreen(
    PeopleScreen,
    buildTrackingObj('people : people', 'people'),
    {
      tabBarLabel: i18next.t('appRoutes:people'),
      tabBarIcon: navIcon('peopleIcon'),
    }
  ),
  ImpactTab: buildTrackedScreen(
    ImpactScreen,
    buildTrackingObj('impact : impact', 'impact'),
    {
      tabBarLabel: i18next.t('appRoutes:impact'),
      tabBarIcon: navIcon('impactIcon'),
    },
  ),
};

export const MainTabRoutes = TabNavigator(
  tabs, {
    // initialRouteName: 'ImpactTab',
    tabBarOptions: {
      showIcon: true,
      showLabel: true,
      style: { backgroundColor: theme.white },
      activeTintColor: theme.primaryColor,
      inactiveTintColor: theme.inactiveColor,
      tabStyle: { backgroundColor: theme.lightBackgroundColor },
      labelStyle: labelStyle(),
      indicatorStyle: { backgroundColor: 'transparent' } ,
      upperCaseLabel: false,

      // Android
      scrollEnabled: false,
    },
    swipeEnabled: false,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    // lazy: false, // Load all tabs right away
    lazy: true,
    paths: {
      StepsTab: '/steps',
      PeopleTab: '/people',
      ImpactTab: '/impact',
    },
  });

export const MAIN_TABS_SCREEN = buildTrackedScreen(
  DrawerNavigator({
    Main: { screen: MainTabRoutes },
  }, {
    contentComponent: SettingsMenu,
    navigationOptions: { drawerLockMode: 'locked-closed' },
  }),
  stepsTab, //stepsTab is shown when MainTabs first opens
);

const screens = {
  [LOGIN_OPTIONS_SCREEN]: buildTrackedScreen(LoginOptionsScreen, buildTrackingObj('auth : auth', 'auth')),
  [KEY_LOGIN_SCREEN]: buildTrackedScreen(KeyLoginScreen, buildTrackingObj('auth : sign in', 'auth'), { gesturesEnabled: true }),
  [WELCOME_SCREEN]: buildTrackedScreen(WelcomeScreen, buildTrackingObj('onboarding : welcome', 'onboarding')),
  [SETUP_SCREEN]: buildTrackedScreen(SetupScreen, buildTrackingObj('onboarding : name', 'onboarding')),
  [GET_STARTED_SCREEN]: buildTrackedScreen(GetStartedScreen, buildTrackingObj('onboarding : get started', 'onboarding')),
  [STAGE_SUCCESS_SCREEN]: buildTrackedScreen(StageSuccessScreen, buildTrackingObj('onboarding : self : choose my steps', 'onboarding', 'self')),
  [SELECT_MY_STEP_SCREEN]: buildTrackedScreen(SelectMyStepScreen, buildTrackingObj('onboarding : self : steps : add', 'onboarding', 'self', 'steps')),
  [SELECT_MY_STEP_ONBOARDING_SCREEN]: buildTrackedScreen(SelectMyStepScreen, buildTrackingObj('onboarding : self : steps : add', 'onboarding', 'self', 'steps')),
  [ADD_SOMEONE_SCREEN]: buildTrackedScreen(AddSomeoneScreen, buildTrackingObj('onboarding : add person : add person', 'onboarding', 'add person')),
  [ADD_CONTACT_SCREEN]: buildTrackedScreen(AddContactScreen, buildTrackingObj('onboarding : people : add person', 'onboarding', 'people', 'add person')),
  [SETUP_PERSON_SCREEN]: buildTrackedScreen(SetupPersonScreen, buildTrackingObj('onboarding : add person : name', 'onboarding, add person')),
  [NOTIFICATION_PRIMER_SCREEN]: buildTrackedScreen(NotificationPrimerScreen, buildTrackingObj('menu : notifications : permissions', 'menu', 'notifications')),
  [NOTIFICATION_OFF_SCREEN]: buildTrackedScreen(NotificationOffScreen, buildTrackingObj( 'menu : notifications : off', 'menu', 'notifications')),
  [CELEBRATION_SCREEN]: buildTrackedScreen(CelebrationScreen, buildTrackingObj('onboarding : complete', 'onboarding')),
  [SEARCH_SCREEN]: buildTrackedScreen(SearchPeopleScreen, buildTrackingObj('mh : search : search', 'search') , { gesturesEnabled: true }),
  [SEARCH_FILTER_SCREEN]: buildTrackedScreen(SearchPeopleFilterScreen, buildTrackingObj('mh : search : refine : refine', 'search', 'refine'), { gesturesEnabled: true }),
  [MAIN_TABS]: MAIN_TABS_SCREEN,
};

export const trackableScreens = {
  ...screens,
  ...tabs,
};

export const MainStackRoutes = StackNavigator({
  ...screens,
  [LOGIN_SCREEN]: { screen: LoginScreen },
  Profile: { screen: ProfileScreen, navigationOptions: { gesturesEnabled: true } },
  [STAGE_ONBOARDING_SCREEN]: { screen: StageScreen },
  [PERSON_SELECT_STEP_SCREEN]: { screen: PersonSelectStepScreen, navigationOptions: { gesturesEnabled: true } },
  [SELECT_MY_STEP_SCREEN]: { screen: SelectMyStepScreen, navigationOptions: { gesturesEnabled: true } },
  [ADD_STEP_SCREEN]: { screen: AddStepScreen },

  [PERSON_STAGE_SCREEN]: { screen: PersonStageScreen, navigationOptions: { gesturesEnabled: true } },
  [STAGE_SCREEN]: { screen: StageScreen, navigationOptions: { gesturesEnabled: true } },
  [SEARCH_REFINE_SCREEN]: { screen: SearchPeopleFilterRefineScreen, navigationOptions: { gesturesEnabled: true } },
  [CONTACT_SCREEN]: {
    screen: DrawerNavigator(
      {
        Main: { screen: ContactScreen },
      },
      {
        contentComponent: ContactSideMenu,
        drawerPosition: 'right',
        navigationOptions: { drawerLockMode: 'locked-closed' },
      }
    ),
    navigationOptions: { gesturesEnabled: true },
  },
}, {
  navigationOptions: {
    header: null,
    gesturesEnabled: false,
  },
});

export const MainRoutes = MainStackRoutes;
