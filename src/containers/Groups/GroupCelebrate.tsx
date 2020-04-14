import React, { useContext } from 'react';
import { connect } from 'react-redux-legacy';
import { useDispatch } from 'react-redux';

import CelebrateFeed from '../CelebrateFeed';
import { TrackStateContext } from '../../actions/analytics';
import { refreshCommunity } from '../../actions/organizations';
import { organizationSelector } from '../../selectors/organizations';
import { orgIsGlobal, shouldQueryReportedComments } from '../../utils/common';
import { getAnalyticsPermissionType } from '../../utils/analytics';
import { ANALYTICS_PERMISSION_TYPE } from '../../constants';
import { getReportedComments } from '../../actions/reportComments';
import { orgPermissionSelector } from '../../selectors/people';
import { AuthState } from '../../reducers/auth';
import { Organization, OrganizationsState } from '../../reducers/organizations';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { CommunitiesCollapsibleHeaderContext } from '../Communities/CommunityHeader/CommunityHeader';

export interface GroupCelebrateProps {
  organization: Organization;
  shouldQueryReport: boolean;
  analyticsPermissionType: TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE];
}

const GroupCelebrate = ({
  organization,
  shouldQueryReport,
  analyticsPermissionType,
}: GroupCelebrateProps) => {
  const dispatch = useDispatch();
  useAnalytics(['community', 'celebrate'], {
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType },
  });

  const handleRefetch = () => {
    dispatch(refreshCommunity(organization.id));
    shouldQueryReport && dispatch(getReportedComments(organization.id));
  };

  const { collapsibleScrollViewProps } = useContext(
    CommunitiesCollapsibleHeaderContext,
  );

  return collapsibleScrollViewProps ? (
    <CelebrateFeed
      testID="CelebrateFeed"
      organization={organization}
      onRefetch={handleRefetch}
      itemNamePressable={!orgIsGlobal(organization)}
      collapsibleScrollViewProps={collapsibleScrollViewProps}
    />
  ) : null;
};

const mapStateToProps = (
  {
    auth,
    organizations,
  }: { auth: AuthState; organizations: OrganizationsState },
  { orgId }: { orgId: string },
) => {
  const organization = organizationSelector({ organizations }, { orgId });
  const myOrgPermission = orgPermissionSelector(
    {},
    { person: auth.person, organization },
  );

  return {
    organization,
    shouldQueryReport: shouldQueryReportedComments(
      organization,
      myOrgPermission,
    ),
    analyticsPermissionType: getAnalyticsPermissionType(auth, organization),
  };
};

export default connect(mapStateToProps)(GroupCelebrate);
