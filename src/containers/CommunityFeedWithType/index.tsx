import React from 'react';
import { View, StatusBar } from 'react-native';
import { useNavigationParam } from 'react-navigation-hooks';

import { CommunityFeed } from '../CommunityFeed';
import { orgIsGlobal } from '../../utils/common';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';
import PostTypeLabel, {
  PostLabelSizeEnum,
} from '../../components/PostTypeLabel';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { getPostTypeAnalytics } from '../../utils/analytics';
import theme from '../../theme';

const StatusBarBgStyle: {
  [key in FeedItemSubjectTypeEnum]: string;
} = {
  ANNOUNCEMENT: theme.communityAnnouncementGrey,
  ACCEPTED_COMMUNITY_CHALLENGE: theme.communityChallengeGreen,
  COMMUNITY_CHALLENGE: theme.communityChallengeGreen,
  COMMUNITY: theme.communityChallengeGreen,
  COMMUNITY_PERMISSION: theme.communityChallengeGreen,
  HELP_REQUEST: theme.communityHelpRequestRed,
  PRAYER_REQUEST: theme.communityPrayerRequestPurple,
  QUESTION: theme.communityQuestionOrange,
  STEP: theme.secondaryColor,
  STORY: theme.communityGodStoryPurple,
  THOUGHT: theme.communityThoughtGrey,
};

const CommunityFeedWithType = () => {
  const communityId: string = useNavigationParam('communityId');
  const communityName: string = useNavigationParam('communityName');
  const type: FeedItemSubjectTypeEnum = useNavigationParam('type');

  useAnalytics(['feed', 'card', getPostTypeAnalytics(type)], {
    permissionType: { communityId },
  });

  return (
    <View style={{ height: '100%' }}>
      <StatusBar
        {...theme.statusBar.lightContent}
        backgroundColor={StatusBarBgStyle[type]}
      />
      <PostTypeLabel
        communityName={communityName}
        type={type}
        size={PostLabelSizeEnum.extraLarge}
      />
      <CommunityFeed
        communityId={communityId}
        itemNamePressable={!orgIsGlobal({ id: communityId })}
        filteredFeedType={type}
      />
    </View>
  );
};

export default CommunityFeedWithType;

export const COMMUNITY_FEED_WITH_TYPE_SCREEN =
  'nav/COMMUNITY_FEED_WITH_TYPE_SCREEN';
