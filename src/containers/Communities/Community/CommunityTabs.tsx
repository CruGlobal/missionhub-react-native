import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
// eslint-disable-next-line import/named
import { NavigationProp, NavigationState } from 'react-navigation';

import { CollapsibleViewProvider } from '../../../components/CollapsibleView/CollapsibleView';

import {
  CommunityHeader,
  CommunitiesCollapsibleHeaderContext,
} from './CommunityHeader/CommunityHeader';
import { communityTabs } from './constants';

const CommunityTabsHeader = () => <CommunityHeader />;

const CommunityTabsNavigator = createMaterialTopTabNavigator(
  communityTabs.reduce(
    (acc, tab) => ({
      ...acc,
      [tab.navigationAction]: tab.component,
    }),
    {},
  ),
  {
    backBehavior: 'none',
    lazy: true,
    tabBarComponent: CommunityTabsHeader,
  },
);

export const CommunityTabs = ({
  navigation,
}: {
  navigation: NavigationProp<NavigationState>;
}) => (
  <CollapsibleViewProvider context={CommunitiesCollapsibleHeaderContext}>
    <CommunityTabsNavigator navigation={navigation} />
  </CollapsibleViewProvider>
);
CommunityTabs.router = CommunityTabsNavigator.router;
