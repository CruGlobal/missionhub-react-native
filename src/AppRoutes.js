import React from 'react';
import {StackNavigator, TabNavigator} from 'react-navigation';

import LoginScreen from './containers/LoginScreen';
import InteractionsScreen from './containers/InteractionsScreen';
import HistoryScreen from './containers/HistoryScreen';
import StepsScreen from './containers/StepsScreen';
import SelectStepScreen from './containers/SelectStepScreen';
import AddStepScreen from './containers/AddStepScreen';
import ProfileScreen from './containers/ProfileScreen';
import WelcomeScreen from './containers/WelcomeScreen';
import SetupScreen from './containers/SetupScreen';
import GetStartedScreen from './containers/GetStartedScreen';
import StageScreen from './containers/StageScreen';
import StageSuccessScreen from './containers/StageSuccessScreen';

import {Icon} from './components/common';

import theme, {COLORS} from './theme';

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

const navIcon = (name) => ({tintColor}) => <Icon name={name} size={30} style={{color: tintColor}} />;


export const MainTabRoutes = TabNavigator({
  InteractionsTab: {
    screen: InteractionsScreen,
    navigationOptions: {
      tabBarLabel: 'Interactions',
      tabBarIcon: navIcon('home'),
    },
  },
  StepsTab: {
    screen: StepsScreen,
    navigationOptions: {
      tabBarLabel: 'Steps',
      tabBarIcon: navIcon('home'),
    },
  },
  HistoryTab: {
    screen: HistoryScreen,
    navigationOptions: {
      tabBarLabel: 'History',
      tabBarIcon: navIcon('home'),
    },
  },
  ProfileTab: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: navIcon('person'),
    },
  },
}, {
  tabBarOptions: {
    showIcon: true,
    showLabel: true,
    style: {backgroundColor: theme.primaryColor},
    activeTintColor: theme.primaryColor,
    inactiveTintColor: COLORS.GREY,
    labelStyle: {color: theme.primaryColor},
    tabStyle: {backgroundColor: theme.lightBackgroundColor},
  },
  tabBarPosition: 'bottom',
  animationEnabled: false,
  lazy: false, // Load all tabs right away
  paths: {
    InteractionsTab: '/interactions',
    StepsTab: '/steps',
    HistoryTab: '/history',
    ProfileTab: '/profile',
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
