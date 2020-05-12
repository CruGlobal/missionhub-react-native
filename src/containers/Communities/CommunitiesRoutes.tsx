import CommunityMembers, {
  COMMUNITY_MEMBERS,
} from './Community/CommunityMembers/CommunityMembers';
import { CommunityTabs } from './Community/CommunityTabs';
import { COMMUNITY_TABS } from './Community/constants';
import {
  COMMUNITY_PROFILE,
  CommunityProfile,
} from './Community/CommunityProfile/CommunityProfile';

export const CommunitiesRoutes = {
  [COMMUNITY_TABS]: CommunityTabs,
  [COMMUNITY_PROFILE]: CommunityProfile,
  [COMMUNITY_MEMBERS]: CommunityMembers,
};
