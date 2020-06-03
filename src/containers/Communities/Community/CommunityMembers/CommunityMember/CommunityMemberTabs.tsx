import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
// eslint-disable-next-line import/named
import { NavigationProp, NavigationState } from 'react-navigation';
import i18next from 'i18next';

import { Text } from '../../../../../components/common';
import {
  CollapsibleViewProvider,
  createCollapsibleViewContext,
} from '../../../../../components/CollapsibleView/CollapsibleView';

import { CommunityMemberHeader } from './CommuntyMemberHeader/CommunityMemberHeader';

export const communityMemberTabs = [
  {
    name: i18next.t('personTabs:feed'),
    navigationAction: 'testFeed',
    component: () => <Text>feed</Text>,
  },
  {
    name: i18next.t('personTabs:impact'),
    navigationAction: 'testImpact',
    component: () => <Text>impact</Text>,
  },
];

const CommunityMemberTabsNavigator = createMaterialTopTabNavigator(
  communityMemberTabs.reduce(
    (acc, tab) => ({
      ...acc,
      [tab.navigationAction]: tab.component,
    }),
    {},
  ),
  {
    backBehavior: 'none',
    lazy: true,
    tabBarComponent: CommunityMemberHeader,
  },
);

export const CommunityMemberCollapsibleHeaderContext = createCollapsibleViewContext();

export const CommunityMemberTabs = ({
  navigation,
}: {
  navigation: NavigationProp<NavigationState>;
}) => (
  <CollapsibleViewProvider context={CommunityMemberCollapsibleHeaderContext}>
    <CommunityMemberTabsNavigator navigation={navigation} />
  </CollapsibleViewProvider>
);
CommunityMemberTabs.router = CommunityMemberTabsNavigator.router;

export const COMMUNITY_MEMBER_TABS = 'nav/COMMUNITY_MEMBER_TABS';
