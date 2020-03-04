import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { ORG_PERMISSIONS, ANALYTICS_ASSIGNMENT_TYPE } from '../../../constants';
import { Person } from '../../../reducers/people';
import { Organization } from '../../../reducers/organizations';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import MemberCelebrate from '..';

jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../CelebrateFeed', () => 'CelebrateFeed');

const myId = '2';
const organization: Organization = { id: '123' };
const person: Person = {
  id: '1',
  organizational_permission: [
    { organization_id: organization.id, permission_id: ORG_PERMISSIONS.OWNER },
  ],
};

const initialState = {
  auth: { person: { id: myId } },
  organizations: { all: [organization] },
};

describe('MemberCelebrate', () => {
  it('renders correctly', () => {
    renderWithContext(
      <MemberCelebrate person={person} organization={organization} />,
      {
        initialState,
      },
    ).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(['person', 'celebrate'], {
      screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: 'contact' },
    });
  });

  it('renders correctly for me', () => {
    renderWithContext(
      <MemberCelebrate
        person={{ ...person, id: myId }}
        organization={organization}
      />,
      {
        initialState,
      },
    ).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(['person', 'celebrate'], {
      screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: 'self' },
    });
  });

  it('renders correctly for me', () => {
    renderWithContext(
      <MemberCelebrate
        person={{
          ...person,
          organizational_permissions: [
            {
              organization_id: organization.id,
              permission_id: ORG_PERMISSIONS.OWNER,
            },
          ],
        }}
        organization={organization}
      />,
      {
        initialState,
      },
    ).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(['person', 'celebrate'], {
      screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: 'community member' },
    });
  });
});
