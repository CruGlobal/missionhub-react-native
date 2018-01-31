import React from 'react';
import { Platform } from 'react-native';
import { StackNavigator, TabNavigator, DrawerNavigator } from 'react-navigation';

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
import StageScreen from './containers/StageScreen';
import StageSuccessScreen, { STAGE_SUCCESS_SCREEN } from './containers/StageSuccessScreen';
import AddSomeoneScreen, { ADD_SOMEONE_SCREEN } from './containers/AddSomeoneScreen';
import ContactScreen from './containers/ContactScreen';
import AddContactScreen from './containers/AddContactScreen';
import NotificationPrimerScreen, { NOTIFICATION_PRIMER_SCREEN } from './containers/NotificationPrimerScreen';
import ImpactScreen from './containers/ImpactScreen';
import SetupPersonScreen, { SETUP_PERSON_SCREEN } from './containers/SetupPersonScreen';
import PersonStageScreen from './containers/PersonStageScreen';
import CelebrationScreen from './containers/CelebrationScreen';
import SearchPeopleScreen from './containers/SearchPeopleScreen';
import SearchPeopleFilterScreen from './containers/SearchPeopleFilterScreen';
import SearchPeopleFilterRefineScreen from './containers/SearchPeopleFilterRefineScreen';
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

const tabs = {
  StepsTab: {
    screen: StepsScreen,
    navigationOptions: {
      tabBarLabel: 'Steps',
      tabBarIcon: navIcon('stepsIcon'),
    },
    name: 'mh : steps',
  },
  PeopleTab: {
    screen: PeopleScreen,
    navigationOptions: {
      tabBarLabel: 'People',
      tabBarIcon: navIcon('peopleIcon'),
    },
    name: 'mh : people',
  },
  ImpactTab: {
    screen: ImpactScreen,
    navigationOptions: {
      tabBarLabel: 'Impact',
      tabBarIcon: navIcon('impactIcon'),
    },
    name: 'mh : impact',
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
  [LOGIN_SCREEN]: { screen: LoginScreen, name: 'mh : auth' },
  [KEY_LOGIN_SCREEN]: { screen: KeyLoginScreen, name: 'mh : auth : sign in' },
  [WELCOME_SCREEN]: { screen: WelcomeScreen, name: 'mh : onboarding : welcome' },
  [SETUP_SCREEN]: { screen: SetupScreen, name: 'mh : onboarding : name' },
  [GET_STARTED_SCREEN]: { screen: GetStartedScreen, name: 'mh : onboarding : get started' },
  [STAGE_SUCCESS_SCREEN]: { screen: StageSuccessScreen, name: 'mh : onboarding : self : choose my steps' },
  [SELECT_MY_STEP_SCREEN]: { screen: SelectMyStepScreen, name: 'mh : onboarding : self : steps' },
  [ADD_STEP_SCREEN]: { screen: AddStepScreen, name: 'mh : onboarding : self : steps : create' },
  [ADD_SOMEONE_SCREEN]: { screen: AddSomeoneScreen, name: 'mh : onboarding : add person' },
  [SETUP_PERSON_SCREEN]: { screen: SetupPersonScreen, name: 'mh : onboarding : add person : name' },
  [PERSON_SELECT_STEP_SCREEN]: { screen: PersonSelectStepScreen, name: 'mh : onboarding : add person : steps' },
  [NOTIFICATION_PRIMER_SCREEN]: { screen: NotificationPrimerScreen, name: 'mh : menu : notifications : permissions' },
  [NOTIFICATION_OFF_SCREEN]: { screen: NotificationOffScreen, name: 'mh : menu : notifications : off' },
};

export const trackableScreens = {
  ...screens,
  ...tabs,
};

export const MainStackRoutes = StackNavigator({
  [MAIN_TABS]: {
    screen: DrawerNavigator({
      Main: { screen: MainTabRoutes },
    }, {
      contentComponent: SettingsMenu,
    }),
  },
  ...screens,
  Profile: { screen: ProfileScreen },
  Stage: { screen: StageScreen },
  Contact: {
    screen: DrawerNavigator(
      {
        Main: { screen: ContactScreen },
      },
      {
        contentComponent: ContactSideMenu,
        drawerPosition: 'right',
      }
    ),
  },
  AddContact: { screen: AddContactScreen },
  PersonStage: { screen: PersonStageScreen },
  Celebration: { screen: CelebrationScreen },
  SearchPeople: { screen: SearchPeopleScreen },
  SearchPeopleFilter: { screen: SearchPeopleFilterScreen },
  SearchPeopleFilterRefine: { screen: SearchPeopleFilterRefineScreen },
}, {
  navigationOptions: {
    header: null,
  },
});

export const MainRoutes = MainStackRoutes;
