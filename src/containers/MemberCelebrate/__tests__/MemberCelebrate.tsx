import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { ORG_PERMISSIONS } from '../../../constants';
import { Person } from '../../../reducers/people';
import { Organization } from '../../../reducers/organizations';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import MemberCelebrate from '..';

jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../CelebrateFeed', () => ({
  CelebrateFeed: 'CelebrateFeed',
}));

const myId = '2';
const personId = '1';
const communityId = '123';
const organization: Organization = { id: communityId };
const person: Person = {
  id: personId,
  organizational_permission: [
    { organization_id: organization.id, permission_id: ORG_PERMISSIONS.OWNER },
  ],
};

const initialState = {
  auth: { person: { id: myId } },
  organizations: { all: [organization] },
  people: { people: { [myId]: { id: myId }, [person.id]: person } },
};

describe('MemberCelebrate', () => {
  it('renders correctly', () => {
    renderWithContext(
      <MemberCelebrate personId={person.id} communityId={organization.id} />,
      {
        initialState,
      },
    ).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(
      ['person', 'celebrate'],
      { personId, communityId },
      {
        includeAssignmentType: true,
      },
    );
  });

  it('renders correctly for me', () => {
    renderWithContext(
      <MemberCelebrate personId={myId} communityId={organization.id} />,
      {
        initialState,
      },
    ).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(
      ['person', 'celebrate'],
      { personId: myId, communityId },
      {
        includeAssignmentType: true,
      },
    );
  });

  it('renders correctly for owner', () => {
    renderWithContext(
      <MemberCelebrate personId={person.id} communityId={organization.id} />,
      {
        initialState: {
          ...initialState,
          people: {
            people: {
              [person.id]: [
                {
                  ...person,
                  organizational_permissions: [
                    {
                      organization_id: organization.id,
                      permission_id: ORG_PERMISSIONS.OWNER,
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    ).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(
      ['person', 'celebrate'],
      { personId, communityId },
      {
        includeAssignmentType: true,
      },
    );
  });
});
