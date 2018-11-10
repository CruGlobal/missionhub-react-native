import React, { Component } from 'react';
import {
  createBottomTabNavigator,
  createDrawerNavigator,
} from 'react-navigation';
import i18next from 'i18next';
import connect from 'react-redux/es/connect/connect';

import { buildTrackingObj, isAndroid } from '../utils/common';
import { Flex, Icon, Text } from '../components/common';
import { GROUPS_TAB, IMPACT_TAB, PEOPLE_TAB, STEPS_TAB } from '../constants';
import PeopleScreen from '../containers/PeopleScreen';
import ImpactScreen from '../containers/ImpactScreen';
import GroupsListScreen from '../containers/Groups/GroupsListScreen';
import theme from '../theme';
import SettingsMenu from '../components/SettingsMenu';

import { StepsTabNavigator } from './mainTabs/stepsTab';

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

const tabs = {
  [STEPS_TAB]: {
    screen: StepsTabNavigator,
    tracking: buildTrackingObj(['steps']),
    navigationOptions: {
      tabBarLabel: tabBarButton('steps'),
    },
  },
  [PEOPLE_TAB]: {
    screen: PeopleScreen,
    tracking: buildTrackingObj(['people']),
    navigationOptions: {
      tabBarLabel: tabBarButton('people'),
    },
  },
  [IMPACT_TAB]: {
    screen: ImpactScreen,
    tracking: buildTrackingObj(['impact']),
    navigationOptions: {
      tabBarLabel: tabBarButton('impact'),
    },
  },
  [GROUPS_TAB]: {
    screen: GroupsListScreen,
    tracking: buildTrackingObj(['groups']),
    navigationOptions: {
      tabBarLabel: tabBarButton('groups'),
    },
  },
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

const MainTabBar = createTabs(IMPACT_TAB, '/impact');

const MainTabBarGroups = createTabs(GROUPS_TAB, '/groups');

class MainTabs extends Component {
  render() {
    return this.props.groups ? <MainTabBarGroups /> : <MainTabBar />;
  }
}

const mapStateToProps = ({ auth }) => ({
  groups: auth.person.user.groups_feature,
});

const MainTabsScreen = connect(mapStateToProps)(MainTabs);

export const MainTabsNavigator = createDrawerNavigator(
  {
    Main: { screen: MainTabsScreen },
  },
  {
    contentComponent: SettingsMenu,
    navigationOptions: { drawerLockMode: 'locked-closed' },
    backBehavior: 'none', // We're handling it on our own
  },
);
