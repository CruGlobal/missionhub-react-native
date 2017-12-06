import React from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';

import LoginScreen from './containers/LoginScreen';
import StepsScreen from './containers/StepsScreen';
import PeopleScreen from './containers/PeopleScreen';
import SelectStepScreen from './containers/SelectStepScreen';
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

const navIcon = (name) => ({tintColor}) => <Icon type="MissionHub" name={name} size={30} style={{color: tintColor}} />;


export const MainTabRoutes = TabNavigator({
  StepsTab: {
    screen: StepsScreen,
    navigationOptions: {
      tabBarLabel: 'Steps',
      tabBarIcon: navIcon('stepsIcon'),
    },
  },
  PeopleTab: {
    screen: PeopleScreen,
    navigationOptions: {
      tabBarLabel: 'People',
      tabBarIcon: navIcon('peopleIcon'),
    },
  },
  ImpactTab: {
    screen: StepsScreen,
    navigationOptions: {
      tabBarLabel: 'Impact',
      tabBarIcon: navIcon('impactIcon'),
    },
  },
}, {
  tabBarOptions: {
    showIcon: true,
    showLabel: true,
    style: {backgroundColor: theme.white},
    activeTintColor: theme.primaryColor,
    inactiveTintColor: theme.inactiveColor,
    tabStyle: {backgroundColor: theme.lightBackgroundColor},
  },
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
  MainTabs: {screen: MainTabRoutes},
  Profile: {screen: ProfileScreen},
  Step: {screen: SelectStepScreen},
  AddStep: {screen: AddStepScreen},
  Login: {screen: LoginScreen},
  Welcome: {screen: WelcomeScreen},
  Setup: {screen: SetupScreen},
  GetStarted: {screen: GetStartedScreen},
  Stage: {screen: StageScreen},
  StageSuccess: {screen: StageSuccessScreen},
  AddSomeone: {screen: AddSomeoneScreen},
  Contact: {screen: ContactScreen},
  AddContact: {screen: AddContactScreen},
}, {
  paths: {
    Login: 'Login',
    Welcome: 'Welcome',
    Setup: 'Setup',
    GetStarted: 'GetStarted',
    Stage: 'Stage',
    StageSuccess: 'StageSuccess',
    AddSomeone: 'AddSomeone',
    Contact: 'Contact',
  },
  navigationOptions: {
    header: null,
  },
});

export const MainRoutes = MainStackRoutes;
