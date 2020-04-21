import i18next from 'i18next';

import GroupCelebrate, {
  COMMUNITY_CELEBRATE,
} from '../../Groups/GroupCelebrate';
import GroupChallenges, {
  COMMUNITY_CHALLENGES,
} from '../../Groups/GroupChallenges';

import {
  COMMUNITY_IMPACT,
  CommunityImpactTab,
} from './CommunityImpactTab/CommunityImpactTab';

// Moved here to prevent circular dependency
export const COMMUNITY_TABS = 'nav/COMMUNITY_TABS';

export const communityTabs = [
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
