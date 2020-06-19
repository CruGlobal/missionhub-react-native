import React, { useContext } from 'react';
import { useNavigationParam } from 'react-navigation-hooks';

import { CollapsibleViewContext } from '../../../../components/CollapsibleView/CollapsibleView';
import { CommunityFeed } from '../../../CommunityFeed';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';
import { orgIsGlobal } from '../../../../utils/common';

interface CommunityFeedTabProps {
  collapsibleHeaderContext: CollapsibleViewContext;
}

export const CommunityFeedTab = ({
  collapsibleHeaderContext,
}: CommunityFeedTabProps) => {
  const communityId: string = useNavigationParam('communityId');
  const personId: string | undefined = useNavigationParam('personId');

  useAnalytics('community feed', {
    permissionType: { communityId },
  });

  const { collapsibleScrollViewProps } = useContext(collapsibleHeaderContext);

  return (
    <CommunityFeed
      testID="CelebrateFeed"
      communityId={communityId}
      personId={personId}
      noHeader={!!personId}
      itemNamePressable={!orgIsGlobal({ id: communityId })}
      collapsibleScrollViewProps={collapsibleScrollViewProps}
    />
  );
};

export const COMMUNITY_FEED = 'nav/COMMUNITY_FEED';
