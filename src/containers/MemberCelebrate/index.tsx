import React from 'react';
import { connect } from 'react-redux-legacy';

import CelebrateFeed from '../CelebrateFeed';
import { organizationSelector } from '../../selectors/organizations';
import Analytics from '../Analytics';
import { Organization, OrganizationsState } from '../../reducers/organizations';
import { Person } from '../../reducers/people';

export interface MemberCelebrateProps {
  organization: Organization;
  person: Person;
}

const MemberCelebrate = ({ organization, person }: MemberCelebrateProps) => {
  return (
    <>
      <Analytics screenName={['person', 'celebrate']} />
      <CelebrateFeed
        organization={organization}
        person={person}
        itemNamePressable={false}
      />
    </>
  );
};

const mapStateToProps = (
  { organizations }: { organizations: OrganizationsState },
  { organization }: { organization: Organization },
) => {
  const selectorOrg = organizationSelector(
    { organizations },
    { orgId: organization.id },
  );

  return {
    organization: selectorOrg as Organization,
  };
};

export default connect(mapStateToProps)(MemberCelebrate);
