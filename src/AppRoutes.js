import React from 'react';
import { Platform } from 'react-native';
import { StackNavigator, TabNavigator, DrawerNavigator } from 'react-navigation';
import i18next from 'i18next';

import LoginScreen, { LOGIN_SCREEN } from './containers/LoginScreen';
import KeyLoginScreen, { KEY_LOGIN_SCREEN } from './containers/KeyLoginScreen';
import StepsScreen from './containers/StepsScreen';
import PeopleScreen from './containers/PeopleScreen';
import SelectMyStepScreen, { SELECT_MY_STEP_SCREEN } from './containers/SelectMyStepScreen';
import PersonSelectStepScreen, { PERSON_SELECT_STEP_SCREEN } from './containers/PersonSelectStepScreen';
import AddStepScreen, { ADD_STEP_SCREEN } from './containers/AddStepScreen';
import ProfileScreen from './containers/ProfileScreen';
import WelcomeScreen, { WELCOME_SCREEN } from './containers/WelcomeScreen';
import SetupScreen, { SETUP_SCREEN } from './containers/SetupScreen';
import GetStartedScreen, { GET_STARTED_SCREEN } from './containers/GetStartedScreen';
import StageScreen, { STAGE_SCREEN } from './containers/StageScreen';
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
import LoginOptionsScreen from './containers/LoginOptionsScreen';
import NotificationOffScreen, { NOTIFICATION_OFF_SCREEN } from './containers/NotificationOffScreen';

import SettingsMenu from './components/SettingsMenu';
import ContactSideMenu from './components/ContactSideMenu';
import { Icon } from './components/common';

import theme from './theme';
import { MAIN_TABS } from './constants';

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

const stepsTab = { name: 'steps : steps' };
const tabs = {
  StepsTab: {
    screen: StepsScreen,
    navigationOptions: {
      tabBarLabel: i18next.t('appRoutes:steps'),
      tabBarIcon: navIcon('stepsIcon'),
    },
    tracking: stepsTab,
  },
  PeopleTab: {
    screen: PeopleScreen,
    navigationOptions: {
      tabBarLabel: i18next.t('appRoutes:people'),
      tabBarIcon: navIcon('peopleIcon'),
    },
    tracking: { name: 'people : people' },
  },
  ImpactTab: {
    screen: ImpactScreen,
    navigationOptions: {
      tabBarLabel: i18next.t('appRoutes:impact'),
      tabBarIcon: navIcon('impactIcon'),
    },
    tracking: { name: 'impact : impact' },
  },
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

const screens = {
  [LOGIN_SCREEN]: { screen: LoginScreen, tracking: { name: 'auth : auth' } },
  [KEY_LOGIN_SCREEN]: { screen: KeyLoginScreen, navigationOptions: { gesturesEnabled: true }, tracking: { name: 'auth : sign in' } },
  [WELCOME_SCREEN]: { screen: WelcomeScreen, tracking: { name: 'onboarding : welcome' } },
  [SETUP_SCREEN]: { screen: SetupScreen, tracking: { name: 'onboarding : name' } },
  [GET_STARTED_SCREEN]: { screen: GetStartedScreen, tracking: { name: 'onboarding : get started' } },
  [STAGE_SUCCESS_SCREEN]: { screen: StageSuccessScreen,tracking: { name: 'onboarding : self : choose my steps' } },
  [SELECT_MY_STEP_SCREEN]: { screen: SelectMyStepScreen, tracking: { name: 'onboarding : self : steps : add' } },
  [ADD_SOMEONE_SCREEN]: { screen: AddSomeoneScreen, tracking: { name: 'onboarding : add person : add person' } },
  [ADD_CONTACT_SCREEN]: { screen: AddContactScreen, tracking: { name: 'onboarding : people : add person' } },
  [SETUP_PERSON_SCREEN]: { screen: SetupPersonScreen, tracking: { name: 'onboarding : add person : name' } },
  [NOTIFICATION_PRIMER_SCREEN]: { screen: NotificationPrimerScreen, tracking: { name: 'menu : notifications : permissions' } },
  [NOTIFICATION_OFF_SCREEN]: { screen: NotificationOffScreen, tracking: { name: 'menu : notifications : off' } },
  [CELEBRATION_SCREEN]: { screen: CelebrationScreen, tracking: { name: 'onboarding : complete' } },
  [SEARCH_SCREEN]: { screen: SearchPeopleScreen, navigationOptions: { gesturesEnabled: true }, tracking: { name: 'mh : search : search' } },
  [SEARCH_FILTER_SCREEN]: { screen: SearchPeopleFilterScreen, navigationOptions: { gesturesEnabled: true }, tracking: { name: 'mh : search : refine : refine' } },
  [MAIN_TABS]: {
    screen: DrawerNavigator({
      Main: { screen: MainTabRoutes },
    }, {
      contentComponent: SettingsMenu,
    }),
    tracking: stepsTab, //stepsTab is shown when MainTabs first opens
  },
};

export const trackableScreens = {
  ...screens,
  ...tabs,
};

export const MainStackRoutes = StackNavigator({
  ...screens,
  Profile: { screen: ProfileScreen, navigationOptions: { gesturesEnabled: true } },
  [STAGE_SCREEN]: { screen: StageScreen },
  [PERSON_SELECT_STEP_SCREEN]: { screen: PersonSelectStepScreen, navigationOptions: { gesturesEnabled: true } },
  [ADD_STEP_SCREEN]: { screen: AddStepScreen },
  LoginOptions: { screen: LoginOptionsScreen },
  [PERSON_STAGE_SCREEN]: { screen: PersonStageScreen, navigationOptions: { gesturesEnabled: true } },
  [SEARCH_REFINE_SCREEN]: { screen: SearchPeopleFilterRefineScreen, navigationOptions: { gesturesEnabled: true } },

  [CONTACT_SCREEN]: {
    screen: DrawerNavigator(
      {
        Main: { screen: ContactScreen },
      },
      {
        contentComponent: ContactSideMenu,
        drawerPosition: 'right',
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
