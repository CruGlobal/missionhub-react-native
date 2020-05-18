import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigationParam } from 'react-navigation-hooks';

import { CelebrateFeed } from '../CelebrateFeed';
import { refreshCommunity } from '../../actions/organizations';
import { organizationSelector } from '../../selectors/organizations';
import { orgIsGlobal } from '../../utils/common';
import { getAnalyticsPermissionType } from '../../utils/analytics';
import { ANALYTICS_PERMISSION_TYPE } from '../../constants';
import { AuthState } from '../../reducers/auth';
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

  const analyticsPermissionType = useSelector(({ auth }: { auth: AuthState }) =>
    getAnalyticsPermissionType(auth, organization),
  );

  useAnalytics(['community', 'celebrate'], {
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType },
  });

  const handleRefetch = () => {
    dispatch(refreshCommunity(organization.id));
  };

  const { collapsibleScrollViewProps } = useContext(
    CommunitiesCollapsibleHeaderContext,
  );

  return (
    <CelebrateFeed
      testID="CelebrateFeed"
      organization={organization}
      onRefetch={handleRefetch}
      itemNamePressable={!orgIsGlobal(organization)}
      collapsibleScrollViewProps={collapsibleScrollViewProps}
    />
  );
};

export default GroupCelebrate;

export const COMMUNITY_FEED = 'nav/COMMUNITY_FEED';
