import React from 'react';
import {
  createBottomTabNavigator,
  createDrawerNavigator,
} from 'react-navigation';
import { BottomTabBar } from 'react-navigation-tabs';
import i18next from 'i18next';
import connect from 'react-redux/es/connect/connect';

import { buildTrackingObj, isAndroid } from '../../utils/common';
import { Flex, Icon, Text } from '../../components/common';
import { GROUPS_TAB, IMPACT_TAB, PEOPLE_TAB, STEPS_TAB } from '../../constants';
import PeopleScreen from '../../containers/PeopleScreen';
import ImpactScreen from '../../containers/ImpactScreen';
import GroupsListScreen from '../../containers/Groups/GroupsListScreen';
import theme from '../../theme';
import SettingsMenu from '../../components/SettingsMenu';

import { StepsTabNavigator } from './stepsTab';

const tabBarButton = name => ({ tintColor }) => (
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

const TabBarComponent = ({ navigation, groups, ...rest }) => (
  <BottomTabBar
    {...rest}
    navigation={{
      ...navigation,
      state: {
        ...navigation.state,
        routes: navigation.state.routes.filter(
          r => r.routeName !== (groups ? IMPACT_TAB : GROUPS_TAB),
        ),
      },
    }}
  />
);

const mapStateToProps = ({ auth }) => ({
  groups: auth.person.user.groups_feature,
});

const ConnectedTabBarComponent = connect(mapStateToProps)(TabBarComponent);

export const mainTabs = {
  [STEPS_TAB]: {
    screen: StepsTabNavigator,
    tracking: buildTrackingObj(['steps']),
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: tabBarButton('steps'),
      tabBarVisible: navigation.state.index === 0,
    }),
  },
  [PEOPLE_TAB]: {
    screen: PeopleScreen,
    tracking: buildTrackingObj(['people']),
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: tabBarButton('people'),
      tabBarVisible: navigation.state.index === 0,
    }),
  },
  [IMPACT_TAB]: {
    screen: ImpactScreen,
    tracking: buildTrackingObj(['impact']),
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: tabBarButton('impact'),
      tabBarVisible: navigation.state.index === 0,
    }),
  },
  [GROUPS_TAB]: {
    screen: GroupsListScreen,
    tracking: buildTrackingObj(['groups']),
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: tabBarButton('groups'),
      tabBarVisible: navigation.state.index === 0,
    }),
  },
};

const MainTabs = createBottomTabNavigator(mainTabs, {
  tabBarComponent: ConnectedTabBarComponent,
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
});

export const MainTabsNavigator = createDrawerNavigator(
  {
    Main: MainTabs,
  },
  {
    contentComponent: SettingsMenu,
    navigationOptions: { drawerLockMode: 'locked-closed' },
    backBehavior: 'none', // We're handling it on our own
  },
);
