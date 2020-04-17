import React from 'react';
import i18next from 'i18next';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import GroupCelebrate from '../../Groups/GroupCelebrate';
import GroupChallenges from '../../Groups/GroupChallenges';

import { CommunityHeader } from './CommunityHeader/CommunityHeader';
import { CommunityImpactTab } from './CommunityImpactTab/CommunityImpactTab';

export const COMMUNITY_CELEBRATE = 'nav/COMMUNITY_CELEBRATE';
export const COMMUNITY_CHALLENGES = 'nav/COMMUNITY_CHALLENGES';
export const COMMUNITY_IMPACT = 'nav/COMMUNITY_IMPACT';

const communityTabs = [
  {
    name: i18next.t('communityTabs:celebrate'),
    navigationAction: COMMUNITY_CELEBRATE,
    component: GroupCelebrate,
  },
  {
    name: i18next.t('communityTabs:challenges'),
    navigationAction: COMMUNITY_CHALLENGES,
    component: GroupChallenges,
  },
  {
    name: i18next.t('communityTabs:impact'),
    navigationAction: COMMUNITY_IMPACT,
    component: CommunityImpactTab,
  },
];

const CommunityTabsHeader = () => <CommunityHeader tabs={communityTabs} />;

export const CommunityTabs = createMaterialTopTabNavigator(
  communityTabs.reduce(
    (acc, tab) => ({
      ...acc,
      [tab.navigationAction]: tab.component,
    }),
    {},
  ),
  {
    // backBehavior: 'none',
    // swipeEnabled: false,
    lazy: true,
    tabBarComponent: CommunityTabsHeader,
  },
);

export const COMMUNITY_TABS = 'nav/COMMUNITY_TABS';
