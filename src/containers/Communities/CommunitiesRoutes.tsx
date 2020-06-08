import CommunityMembers, {
  COMMUNITY_MEMBERS,
} from './Community/CommunityMembers/CommunityMembers';
import { CommunityTabs } from './Community/CommunityTabs';
import { COMMUNITY_TABS } from './Community/constants';
import {
  COMMUNITY_PROFILE,
  CommunityProfile,
} from './Community/CommunityProfile/CommunityProfile';
import FeedItemDetailScreen, {
  FEED_ITEM_DETAIL_SCREEN,
} from './Community/CommunityFeedTab/FeedItemDetailScreen/FeedItemDetailScreen';
import {
  CommunityMemberTabs,
  COMMUNITY_MEMBER_TABS,
} from './Community/CommunityMembers/CommunityMember/CommunityMemberTabs';

export const CommunitiesRoutes = {
  [COMMUNITY_TABS]: CommunityTabs,
  [COMMUNITY_PROFILE]: CommunityProfile,
  [COMMUNITY_MEMBERS]: CommunityMembers,
  [COMMUNITY_MEMBER_TABS]: CommunityMemberTabs,
  [FEED_ITEM_DETAIL_SCREEN]: FeedItemDetailScreen,
};
