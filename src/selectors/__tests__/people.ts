/* eslint-disable max-lines */

import {
  personSelector,
  contactAssignmentSelector,
  orgPermissionSelector,
} from '../people';
import { RootState } from '../../reducers';
import { getAuthPerson } from '../../auth/authUtilities';

jest.mock('../../auth/authUtilities');

const myId = '23';
(getAuthPerson as jest.Mock).mockReturnValue({ id: myId });

const reverse_contact_assignment = {
  assigned_to: { id: myId },
};

const organizationOne = {
  id: '100',
  type: 'organization',
  name: 'Org2',
  people: {
    '30': {
      id: '30',
      type: 'person',
      first_name: 'Fname3',
      last_name: 'Lname2',
      reverse_contact_assignments: [
        { ...reverse_contact_assignment, organization: { id: '100' } },
      ],
    },
    '31': {
      id: '31',
      type: 'person',
      first_name: 'Fname3',
      last_name: 'Lname3',
      reverse_contact_assignments: [
        { ...reverse_contact_assignment, organization: { id: '100' } },
      ],
    },
    '32': {
      id: '32',
      type: 'person',
      first_name: 'Fname3',
      last_name: 'Lname1',
      reverse_contact_assignments: [
        { ...reverse_contact_assignment, organization: { id: '100' } },
      ],
    },
    '371': {
      id: '371',
      type: 'person',
      first_name: 'Fname3',
      last_name: 'Lname1',
      reverse_contact_assignments: [
        { assigned_to: { id: '72347238x' }, organization: { id: '100' } },
      ],
    },
  },
};

const unnamedOrganization = {
  id: '150',
  type: 'organization',
  people: {
    '33': {
      id: '33',
      type: 'person',
      first_name: 'Fname4',
      reverse_contact_assignments: [
        { ...reverse_contact_assignment, organization: { id: '150' } },
      ],
    },
  },
};

const organizationTwo = {
  id: '200',
  type: 'organization',
  name: 'Org1',
  people: {
    '32': {
      id: '32',
      type: 'person',
      first_name: 'Fname3',
      last_name: 'Lname1',
      reverse_contact_assignments: [
        { ...reverse_contact_assignment, organization: { id: '200' } },
      ],
    },
    [myId]: {
      id: myId,
      type: 'person',
      first_name: 'ME in an org',
    },
  },
};

const people = {
  people: {
    '20': {
      id: '20',
      type: 'person',
      first_name: 'Fname2',
      last_name: 'Lname',
      reverse_contact_assignments: [{ ...reverse_contact_assignment }],
    },
    '21': {
      id: '21',
      type: 'person',
      first_name: 'Fname1',
      last_name: 'Lname2',
      reverse_contact_assignments: [{ ...reverse_contact_assignment }],
    },
    '22': {
      id: '22',
      type: 'person',
      first_name: 'Fname1',
      last_name: 'Lname1',
      reverse_contact_assignments: [{ ...reverse_contact_assignment }],
    },
    ...unnamedOrganization.people,
    ...organizationOne.people,
    ...organizationTwo.people,
  },
};

describe('personSelector', () => {
  it('should get a person in the personal org', () => {
    expect(
      personSelector(({ people } as unknown) as RootState, { personId: '22' }),
    ).toMatchSnapshot();
  });
});

describe('contactAssignmentSelector', () => {
  const organizationOne = { id: '100' };
  const organizationTwo = { id: '101' };

  it('should get first contactAssignment for a person that is assigned to the current user', () => {
    expect(
      contactAssignmentSelector({
        person: {
          reverse_contact_assignments: [
            {
              assigned_to: {
                id: '5',
              },
              organization: organizationOne,
            },
            {
              assigned_to: {
                id: myId,
              },
              organization: organizationTwo,
            },
            {
              assigned_to: {
                id: myId,
              },
              organization: { id: '102' },
            },
            {
              assigned_to: {
                id: myId,
              },
              organization: organizationOne,
            },
          ],
          organizational_permissions: [
            {
              organization_id: organizationOne.id,
            },
            {
              organization_id: organizationTwo.id,
            },
          ],
        },
      }),
    ).toEqual({
      assigned_to: {
        id: myId,
      },
      organization: organizationTwo,
    });
  });
});

describe('orgPermissionSelector', () => {
  it("should get a person's organizationalPermission for the current org", () => {
    expect(
      orgPermissionSelector(
        {},
        {
          person: {
            organizational_permissions: [
              {
                organization_id: organizationOne.id,
              },
              {
                organization_id: organizationTwo.id,
              },
            ],
          },
          organization: {
            id: organizationTwo.id,
          },
        },
      ),
    ).toMatchSnapshot();
  });

  it("should get a person's organizationalPermission for the current org | GraphQL", () => {
    expect(
      orgPermissionSelector(
        {},
        {
          person: {
            communityPermissions: {
              nodes: [
                {
                  community: {
                    id: organizationOne.id,
                  },
                  permission: 'admin',
                },
                {
                  community: {
                    id: organizationTwo.id,
                  },
                  permission: 'owner',
                },
              ],
            },
          },
          organization: {
            id: organizationTwo.id,
          },
        },
      ),
    ).toMatchSnapshot();
  });

  it('should handle an undefined person', () => {
    expect(
      orgPermissionSelector(
        {},
        {
          person: undefined,
          organization: {
            id: organizationTwo.id,
          },
        },
      ),
    ).toEqual(undefined);
  });
});
