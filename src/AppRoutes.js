import React from 'react';
import {StackNavigator, TabNavigator} from 'react-navigation';

import LoginScreen from './containers/LoginScreen';
import InteractionsScreen from './containers/InteractionsScreen';
import HistoryScreen from './containers/HistoryScreen';
import StepsScreen from './containers/StepsScreen';
import StepScreen from './containers/StepScreen';
import ProfileScreen from './containers/ProfileScreen';
import WelcomeScreen from './containers/WelcomeScreen';
import SetupScreen from './containers/SetupScreen';
import GetStartedScreen from './containers/GetStartedScreen';
import StageScreen from './containers/StageScreen';

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

const navIcon = (name) => ({tintColor}) => <Icon name={name} size={30} style={{color: tintColor}}/>;


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
  Step: {screen: StepScreen},
}, {
  // paths: {
  //   MainTabs: '',
  //   Profile: 'profile/:id',
  // },
  navigationOptions: {
    // Have each page implement their own header
    header: null,
  },
});

export const LoginRoutes = StackNavigator({
  Login: {screen: LoginScreen},
  // Profile: { screen: ProfileScreen },
}, {
  // transitionConfig: customAnimationFunc,
  paths: {
    Login: 'login',
  },
  navigationOptions: {
    // Have each page implement their own header
    header: null,
    // header: ({ navigation }) => {
    //   const activeRoute = navigation.state.routes[navigation.state.index];
    //   if (activeRoute.routeName === 'Login') return null;
    //   LOG('navigation', navigation);
    //   let text = 'HEADER';
    //   return (
    //     <Text style={{ backgroundColor: 'blue', color: 'yellow', height: 50, textAlign: 'center', paddingTop: 20 }}>
    //       {text}
    //     </Text>
    //   );
    // },
  },
});

export const FirstTimeRoutes = StackNavigator({
  Welcome: {screen: WelcomeScreen},
  Setup: {screen: SetupScreen},
  Login: {screen: WelcomeScreen}, // TODO remove
  GetStarted: {screen: GetStartedScreen},
  Stage: {screen: StageScreen},
}, {
  paths: {
    Setup: 'Setup',
    GetStarted: 'GetStarted',
    Stage: 'Stage',
  },
  navigationOptions: {
    // Have each page implement their own header
    header: null,
  },
});

export const MainRoutes = MainStackRoutes;