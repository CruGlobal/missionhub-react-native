import React from 'react';
import i18next from 'i18next';

import GroupChallenges, {
  COMMUNITY_CHALLENGES,
} from '../../Groups/GroupChallenges';

import {
  CommunityFeedTab,
  COMMUNITY_FEED,
} from './CommunityFeedTab/CommunityFeedTab';
import {
  COMMUNITY_IMPACT,
  CommunityImpactTab,
} from './CommunityImpactTab/CommunityImpactTab';
import { CommunitiesCollapsibleHeaderContext } from './CommunityHeader/CommunityHeader';

// Moved here to prevent circular dependency
export const COMMUNITY_TABS = 'nav/COMMUNITY_TABS';

export const communityTabs = [
  {
    name: i18next.t('communityTabs:feed'),
    navigationAction: COMMUNITY_FEED,
    component: () => (
      <CommunityFeedTab
        collapsibleHeaderContext={CommunitiesCollapsibleHeaderContext}
      />
    ),
  },
  {
    name: i18next.t('communityTabs:challenges'),
    navigationAction: COMMUNITY_CHALLENGES,
    component: GroupChallenges,
  },
  {
    name: i18next.t('communityTabs:impact'),
    navigationAction: COMMUNITY_IMPACT,
    component: () => (
      <CommunityImpactTab
        collapsibleHeaderContext={CommunitiesCollapsibleHeaderContext}
      />
    ),
  },
];
