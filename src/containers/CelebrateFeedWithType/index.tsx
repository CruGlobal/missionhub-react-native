import React from 'react';
import { View, StatusBar } from 'react-native';
import { useNavigationParam } from 'react-navigation-hooks';

import { CommunityFeed } from '../CommunityFeed';
import { orgIsGlobal } from '../../utils/common';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';
import theme from '../../theme';
import PostTypeLabel, {
  PostLabelSizeEnum,
} from '../../components/PostTypeLabel';

const CelebrateFeedWithType = () => {
  const communityId: string = useNavigationParam('communityId');
  const communityName: string = useNavigationParam('communityName');
  const type: FeedItemSubjectTypeEnum = useNavigationParam('type');
  return (
    <View style={{ height: '100%' }}>
      <StatusBar {...theme.statusBar.lightContent} />
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

export default CelebrateFeedWithType;

export const CELEBRATE_FEED_WITH_TYPE_SCREEN =
  'nav/CELEBRATE_FEED_WITH_TYPE_SCREEN';
