import React from 'react';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import CelebrateFeed from '../CelebrateFeed';
import { refreshCommunity } from '../../actions/organizations';
import { organizationSelector } from '../../selectors/organizations';
import { orgIsGlobal, shouldQueryReportedComments } from '../../utils/common';
import { getReportedComments } from '../../actions/reportComments';
import { orgPermissionSelector } from '../../selectors/people';
import { AuthState } from '../../reducers/auth';
import { Organization, OrganizationsState } from '../../reducers/organizations';
import Analytics from '../Analytics';

export interface GroupCelebrateProps {
  dispatch: ThunkDispatch<{ organizations: OrganizationsState }, {}, AnyAction>;
  organization: Organization;
  shouldQueryReport: boolean;
}

const GroupCelebrate = ({
  dispatch,
  organization,
  shouldQueryReport,
}: GroupCelebrateProps) => {
  const handleRefetch = () => {
    dispatch(refreshCommunity(organization.id));
    shouldQueryReport && dispatch(getReportedComments(organization.id));
  };

  return (
    <>
      <Analytics screenName={['community', 'celebrate']} />
      <CelebrateFeed
        testID="CelebrateFeed"
        organization={organization}
        onRefetch={handleRefetch}
        itemNamePressable={!orgIsGlobal(organization)}
      />
    </>
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
  };
};

export default connect(mapStateToProps)(GroupCelebrate);
