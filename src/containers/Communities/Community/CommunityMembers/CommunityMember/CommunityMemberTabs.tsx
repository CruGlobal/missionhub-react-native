import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
// eslint-disable-next-line import/named
import { NavigationProp, NavigationState } from 'react-navigation';
import i18next from 'i18next';

import {
  CollapsibleViewProvider,
  createCollapsibleViewContext,
} from '../../../../../components/CollapsibleView/CollapsibleView';
import {
  CommunityFeedTab,
  COMMUNITY_FEED,
} from '../../CommunityFeedTab/CommunityFeedTab';
import { ImpactTab, IMPACT_TAB } from '../../../../ImpactTab/ImpactTab';
import { PersonHeader } from '../../../../../components/PersonHeader/PersonHeader';

const CommunityMemberCollapsibleHeaderContext = createCollapsibleViewContext();

export const communityMemberTabs = [
  {
    name: i18next.t('personTabs:feed'),
    navigationAction: COMMUNITY_FEED,
    component: () => (
      <CommunityFeedTab
        collapsibleHeaderContext={CommunityMemberCollapsibleHeaderContext}
      />
    ),
  },
  {
    name: i18next.t('personTabs:impact'),
    navigationAction: IMPACT_TAB,
    component: () => (
      <ImpactTab
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
    tabBarComponent: () => (
      <PersonHeader
        isMember
        tabs={communityMemberTabs}
        collapsibleHeaderContext={CommunityMemberCollapsibleHeaderContext}
      />
    ),
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
