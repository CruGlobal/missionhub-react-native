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
import CommunityFeed, {
  COMMUNITY_FEED,
} from '../../../../Groups/GroupCelebrate';
import {
  COMMUNITY_IMPACT,
  CommunityImpactTab,
} from '../../CommunityImpactTab/CommunityImpactTab';

import { CommunityMemberHeader } from './CommuntyMemberHeader/CommunityMemberHeader';

export const CommunityMemberCollapsibleHeaderContext = createCollapsibleViewContext();

export const communityMemberTabs = [
  {
    name: i18next.t('personTabs:feed'),
    navigationAction: COMMUNITY_FEED,
    component: () => (
      <CommunityFeed
        collapsibleHeaderContext={CommunityMemberCollapsibleHeaderContext}
      />
    ),
  },
  {
    name: i18next.t('personTabs:impact'),
    navigationAction: COMMUNITY_IMPACT,
    component: () => (
      <CommunityImpactTab
        collapsibleHeaderContext={CommunityMemberCollapsibleHeaderContext}
      />
    ),
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
