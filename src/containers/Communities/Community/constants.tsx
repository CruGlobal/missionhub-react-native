import React from 'react';
import i18next from 'i18next';

import GroupCelebrate, { COMMUNITY_FEED } from '../../Groups/GroupCelebrate';
import GroupChallenges, {
  COMMUNITY_CHALLENGES,
} from '../../Groups/GroupChallenges';
import { IMPACT_TAB, ImpactTab } from '../../ImpactTab/ImpactTab';

import { CommunitiesCollapsibleHeaderContext } from './CommunityHeader/CommunityHeader';

// Moved here to prevent circular dependency
export const COMMUNITY_TABS = 'nav/COMMUNITY_TABS';

export const communityTabs = [
  {
    name: i18next.t('communityTabs:feed'),
    navigationAction: COMMUNITY_FEED,
    component: () => (
      <GroupCelebrate
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
    navigationAction: IMPACT_TAB,
    component: () => (
      <ImpactTab
        collapsibleHeaderContext={CommunitiesCollapsibleHeaderContext}
      />
    ),
  },
];
