import React from 'react';
import { connect, useDispatch } from 'react-redux';

import CelebrateFeed from '../CelebrateFeed';
import { TrackStateContext } from '../../actions/analytics';
import { refreshCommunity } from '../../actions/organizations';
import { organizationSelector } from '../../selectors/organizations';
import {
  orgIsGlobal,
  shouldQueryReportedComments,
  getAnalyticsPermissionType,
} from '../../utils/common';
import { ANALYTICS_PERMISSION_TYPE } from '../../constants';
import { getReportedComments } from '../../actions/reportComments';
import { orgPermissionSelector } from '../../selectors/people';
import { AuthState } from '../../reducers/auth';
import { Organization, OrganizationsState } from '../../reducers/organizations';
import { useAnalytics } from '../../utils/hooks/useAnalytics';

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
  useAnalytics({
    screenName: ['community', 'celebrate'],
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType },
  });
  const dispatch = useDispatch();

  const handleRefetch = () => {
    dispatch(refreshCommunity(organization.id));
    shouldQueryReport && dispatch(getReportedComments(organization.id));
  };

  return (
    <CelebrateFeed
      testID="CelebrateFeed"
      organization={organization}
      onRefetch={handleRefetch}
      itemNamePressable={!orgIsGlobal(organization)}
    />
  );
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
    analyticsPermissionType: getAnalyticsPermissionType(myOrgPermission),
  };
};

export default connect(mapStateToProps)(GroupCelebrate);
