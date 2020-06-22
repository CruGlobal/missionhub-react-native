import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useNavigationParam } from 'react-navigation-hooks';

import { CollapsibleViewContext } from '../../../../components/CollapsibleView/CollapsibleView';
import { CommunityFeed } from '../../../CommunityFeed';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';
import { getAnalyticsPermissionType } from '../../../../utils/analytics';
import { organizationSelector } from '../../../../selectors/organizations';
import { OrganizationsState } from '../../../../reducers/organizations';
import { AuthState } from '../../../../reducers/auth';
import { ANALYTICS_PERMISSION_TYPE } from '../../../../constants';
import { orgIsGlobal } from '../../../../utils/common';

interface CommunityFeedTabProps {
  collapsibleHeaderContext: CollapsibleViewContext;
}

export const CommunityFeedTab = ({
  collapsibleHeaderContext,
}: CommunityFeedTabProps) => {
  const communityId: string = useNavigationParam('communityId');
  const personId: string | undefined = useNavigationParam('personId');

  const organization = useSelector(
    ({ organizations }: { organizations: OrganizationsState }) =>
      organizationSelector({ organizations }, { orgId: communityId }),
  );

  const analyticsPermissionType = useSelector(({ auth }: { auth: AuthState }) =>
    getAnalyticsPermissionType(auth, organization),
  );

  useAnalytics('community feed', {
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType },
  });

  const { collapsibleScrollViewProps } = useContext(collapsibleHeaderContext);

  return (
    <CommunityFeed
      testID="CelebrateFeed"
      communityId={communityId}
      personId={personId}
      noHeader={!!personId}
      itemNamePressable={!orgIsGlobal(organization)}
      collapsibleScrollViewProps={collapsibleScrollViewProps}
    />
  );
};
