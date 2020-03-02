import React from 'react';
import { connect } from 'react-redux-legacy';

import { TrackStateContext } from '../../actions/analytics';
import { getAnalyticsAssignmentType } from '../../utils/common';
import CelebrateFeed from '../CelebrateFeed';
import { ANALYTICS_ASSIGNMENT_TYPE } from '../../constants';
import { organizationSelector } from '../../selectors/organizations';
import { orgPermissionSelector } from '../../selectors/people';
import { Organization, OrganizationsState } from '../../reducers/organizations';
import { Person } from '../../reducers/people';
import { AuthState } from '../../reducers/auth';
import { useAnalytics } from '../../utils/hooks/useAnalytics';

export interface MemberCelebrateProps {
  organization: Organization;
  person: Person;
  analyticsAssignmentType: TrackStateContext[typeof ANALYTICS_ASSIGNMENT_TYPE];
}

const MemberCelebrate = ({
  organization,
  person,
  analyticsAssignmentType,
}: MemberCelebrateProps) => {
  useAnalytics({
    screenName: ['person', 'celebrate'],
    screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType },
  });

  return (
    <CelebrateFeed
      organization={organization}
      person={person}
      itemNamePressable={false}
    />
  );
};

const mapStateToProps = (
  {
    auth,
    organizations,
  }: { auth: AuthState; organizations: OrganizationsState },
  { person, organization }: { person: Person; organization: Organization },
) => {
  const selectorOrg = organizationSelector(
    { organizations },
    { orgId: organization.id },
  );
  const orgPermission = orgPermissionSelector({}, { person, organization });

  return {
    organization: selectorOrg as Organization,
    analyticsAssignmentType: getAnalyticsAssignmentType(
      person.id,
      auth,
      orgPermission,
    ),
  };
};

export default connect(mapStateToProps)(MemberCelebrate);
