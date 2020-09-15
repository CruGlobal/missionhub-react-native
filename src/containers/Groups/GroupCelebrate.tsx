import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigationParam } from 'react-navigation-hooks';

import { CommunityFeed } from '../CommunityFeed';
import { refreshCommunity } from '../../actions/organizations';
import { orgIsGlobal } from '../../utils/common';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { CollapsibleViewContext } from '../../components/CollapsibleView/CollapsibleView';

interface CommunityFeedProps {
  collapsibleHeaderContext: CollapsibleViewContext;
}

const GroupCommunityFeed = ({
  collapsibleHeaderContext,
}: CommunityFeedProps) => {
  const dispatch = useDispatch();

  const communityId: string = useNavigationParam('communityId');

  useAnalytics(['community', 'celebrate'], {
    permissionType: { communityId },
  });

  const handleRefetch = () => {
    // TODO: this still needed?
    dispatch(refreshCommunity(communityId));
  };

  const { collapsibleScrollViewProps } = useContext(collapsibleHeaderContext);

  return (
    <CommunityFeed
      testID="CelebrateFeed"
      communityId={communityId}
      onRefetch={handleRefetch}
      itemNamePressable={!orgIsGlobal({ id: communityId })}
      collapsibleScrollViewProps={collapsibleScrollViewProps}
    />
  );
};

export default GroupCommunityFeed;
