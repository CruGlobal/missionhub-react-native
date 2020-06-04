import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigationParam } from 'react-navigation-hooks';

import { CelebrateFeed } from '../CelebrateFeed';
import { refreshCommunity } from '../../actions/organizations';
import { organizationSelector } from '../../selectors/organizations';
import { orgIsGlobal } from '../../utils/common';
import { OrganizationsState } from '../../reducers/organizations';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { CommunitiesCollapsibleHeaderContext } from '../Communities/Community/CommunityHeader/CommunityHeader';

const GroupCelebrate = () => {
  const dispatch = useDispatch();

  const communityId: string = useNavigationParam('communityId');

  const organization = useSelector(
    ({ organizations }: { organizations: OrganizationsState }) =>
      organizationSelector({ organizations }, { orgId: communityId }),
  );

  useAnalytics(
    ['community', 'celebrate'],
    {},
    {
      includePermissionType: true,
    },
  );

  const handleRefetch = () => {
    // TODO: this still needed?
    dispatch(refreshCommunity(organization.id));
  };

  const { collapsibleScrollViewProps } = useContext(
    CommunitiesCollapsibleHeaderContext,
  );

  return (
    <CelebrateFeed
      testID="CelebrateFeed"
      communityId={communityId}
      onRefetch={handleRefetch}
      itemNamePressable={!orgIsGlobal(organization)}
      collapsibleScrollViewProps={collapsibleScrollViewProps}
    />
  );
};

export default GroupCelebrate;

export const COMMUNITY_FEED = 'nav/COMMUNITY_FEED';
