import React from 'react';
import { Platform } from 'react-native';
import { StackNavigator, TabNavigator, DrawerNavigator } from 'react-navigation';
import i18next from 'i18next';

import LoginScreen from './containers/LoginScreen';
import KeyLoginScreen from './containers/KeyLoginScreen';
import StepsScreen from './containers/StepsScreen';
import PeopleScreen from './containers/PeopleScreen';
import SelectMyStepScreen from './containers/SelectMyStepScreen';
import PersonSelectStepScreen from './containers/PersonSelectStepScreen';
import AddStepScreen from './containers/AddStepScreen';
import ProfileScreen from './containers/ProfileScreen';
import WelcomeScreen from './containers/WelcomeScreen';
import SetupScreen from './containers/SetupScreen';
import GetStartedScreen from './containers/GetStartedScreen';
import StageScreen from './containers/StageScreen';
import StageSuccessScreen from './containers/StageSuccessScreen';
import AddSomeoneScreen from './containers/AddSomeoneScreen';
import ContactScreen from './containers/ContactScreen';
import AddContactScreen from './containers/AddContactScreen';
import NotificationPrimerScreen from './containers/NotificationPrimerScreen';
import ImpactScreen from './containers/ImpactScreen';
import SetupPersonScreen from './containers/SetupPersonScreen';
import PersonStageScreen from './containers/PersonStageScreen';
import CelebrationScreen from './containers/CelebrationScreen';
import SearchPeopleScreen from './containers/SearchPeopleScreen';
import SearchPeopleFilterScreen from './containers/SearchPeopleFilterScreen';
import SearchPeopleFilterRefineScreen from './containers/SearchPeopleFilterRefineScreen';
import NotificationOffScreen from './containers/NotificationOffScreen';

import SettingsMenu from './components/SettingsMenu';
import ContactSideMenu from './components/ContactSideMenu';
import { Icon } from './components/common';

import theme from './theme';

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

export const MainTabRoutes = TabNavigator({
  StepsTab: {
    screen: StepsScreen,
    navigationOptions: {
      tabBarLabel: i18next.t('appRoutes:steps'),
      tabBarIcon: navIcon('stepsIcon'),
    },
  },
  PeopleTab: {
    screen: PeopleScreen,
    navigationOptions: {
      tabBarLabel: i18next.t('appRoutes:people'),
      tabBarIcon: navIcon('peopleIcon'),
    },
  },
  ImpactTab: {
    screen: ImpactScreen,
    navigationOptions: {
      tabBarLabel: i18next.t('appRoutes:impact'),
      tabBarIcon: navIcon('impactIcon'),
    },
  },
}, {
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

export const MainStackRoutes = StackNavigator({
  MainTabs: {
    screen: DrawerNavigator({
      Main: { screen: MainTabRoutes },
    }, {
      contentComponent: SettingsMenu,
    }),
  },
  Profile: { screen: ProfileScreen },
  Step: { screen: SelectMyStepScreen },
  PersonStep: { screen: PersonSelectStepScreen },
  AddStep: { screen: AddStepScreen },
  Login: { screen: LoginScreen },
  KeyLogin: { screen: KeyLoginScreen },
  Welcome: { screen: WelcomeScreen },
  Setup: { screen: SetupScreen },
  GetStarted: { screen: GetStartedScreen },
  Stage: { screen: StageScreen },
  StageSuccess: { screen: StageSuccessScreen },
  AddSomeone: { screen: AddSomeoneScreen },
  Contact: {
    screen: DrawerNavigator({
      Main: { screen: ContactScreen },
    }, {
      contentComponent: ContactSideMenu,
      drawerPosition: 'right',
    }),
  },
  AddContact: { screen: AddContactScreen },
  NotificationPrimer: { screen: NotificationPrimerScreen },
  NotificationOff: { screen: NotificationOffScreen },
  Impact: { screen: ImpactScreen },
  SetupPerson: { screen: SetupPersonScreen },
  PersonStage: { screen: PersonStageScreen },
  Celebration: { screen: CelebrationScreen },
  SearchPeople: { screen: SearchPeopleScreen },
  SearchPeopleFilter: { screen: SearchPeopleFilterScreen },
  SearchPeopleFilterRefine: { screen: SearchPeopleFilterRefineScreen },
}, {
  paths: {
    Login: 'Login',
    KeyLogin: 'KeyLogin',
    Welcome: 'Welcome',
    Setup: 'Setup',
    GetStarted: 'GetStarted',
    Stage: 'Stage',
    StageSuccess: 'StageSuccess',
    AddSomeone: 'AddSomeone',
    Contact: 'Contact',
    SetupPerson: 'SetupPerson',
    PersonStage: 'PersonStage',
    Step: 'Step',
    PersonStep: 'PersonStep',
  },
  navigationOptions: {
    header: null,
  },
});

export const MainRoutes = MainStackRoutes;
