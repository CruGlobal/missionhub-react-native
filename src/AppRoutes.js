import React from 'react';
import {StackNavigator, TabNavigator} from 'react-navigation';

import LoginScreen from './containers/LoginScreen';
import StepsScreen from './containers/StepsScreen';
import SelectStepScreen from './containers/SelectStepScreen';
import ProfileScreen from './containers/ProfileScreen';
import WelcomeScreen from './containers/WelcomeScreen';
import SetupScreen from './containers/SetupScreen';
import GetStartedScreen from './containers/GetStartedScreen';
import StageScreen from './containers/StageScreen';
import StageSuccessScreen from './containers/StageSuccessScreen';

import {Icon} from './components/common';

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
    screen: StepsScreen,
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
  lazy: false, // Load all tabs right away
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
  Login: {screen: LoginScreen},
  Welcome: {screen: WelcomeScreen},
  Setup: {screen: SetupScreen},
  GetStarted: {screen: GetStartedScreen},
  Stage: {screen: StageScreen},
  StageSuccess: {screen: StageSuccessScreen},
}, {
  paths: {
    Login: 'Login',
    Welcome: 'Welcome',
    Setup: 'Setup',
    GetStarted: 'GetStarted',
    Stage: 'Stage',
    StageSuccess: 'StageSuccess',
  },
  navigationOptions: {
    header: null,
  },
});

export const MainRoutes = MainStackRoutes;
