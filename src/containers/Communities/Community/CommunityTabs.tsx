import React from 'react';
import i18next from 'i18next';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
// eslint-disable-next-line import/named
import { NavigationProp, NavigationState } from 'react-navigation';

import GroupCelebrate, {
  COMMUNITY_CELEBRATE,
} from '../../Groups/GroupCelebrate';
import GroupChallenges, {
  COMMUNITY_CHALLENGES,
} from '../../Groups/GroupChallenges';
import { CollapsibleViewProvider } from '../../../components/CollapsibleView/CollapsibleView';

import {
  CommunityHeader,
  CommunitiesCollapsibleHeaderContext,
} from './CommunityHeader/CommunityHeader';
import {
  CommunityImpactTab,
  COMMUNITY_IMPACT,
} from './CommunityImpactTab/CommunityImpactTab';

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
