/* eslint max-lines: 0 */

import {
  allAssignedPeopleSelector,
  personSelector,
  contactAssignmentSelector,
  orgPermissionSelector,
} from '../people';

jest.mock('../../selectors/selectorUtils', () => ({
  removeHiddenOrgs: jest.fn().mockImplementation(orgs => orgs),
}));

const auth = {
  person: {
    id: '23',
    user: {},
  },
};

const reverse_contact_assignment = {
  assigned_to: auth.person,
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
    [auth.person.id]: {
      id: auth.person.id,
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
    [auth.person.id]: {
      id: auth.person.id,
      type: 'person',
      first_name: 'ME',
      last_name: 'Lname',
    },
    ...unnamedOrganization.people,
    ...organizationOne.people,
    ...organizationTwo.people,
  },
};

describe('allAssignedPeopleSelector', () => {
  it('should take the people object and transform it into a single array', () => {
    expect(
      allAssignedPeopleSelector({
        people,
        // @ts-ignore
        auth,
        // @ts-ignore
        organizations: {
          all: [unnamedOrganization, organizationOne, organizationTwo],
        },
      }),
    ).toMatchSnapshot();
  });
});

describe('personSelector', () => {
  it('should get a person in the personal org', () => {
    expect(personSelector({ people }, { personId: '22' })).toMatchSnapshot();
  });
});

describe('contactAssignmentSelector', () => {
  const organizationOne = { id: '100' };
  const organizationTwo = { id: '101' };

  describe('orgId passed in', () => {
    it("should get a contactAssignment for a person that is assigned to the current user's org ministry", () => {
      expect(
        contactAssignmentSelector(
          // @ts-ignore
          { auth },
          {
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
                    id: auth.person.id,
                  },
                  organization: organizationTwo,
                },
                {
                  assigned_to: {
                    id: auth.person.id,
                  },
                  organization: { id: '102' },
                },
                {
                  assigned_to: {
                    id: auth.person.id,
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
            orgId: organizationOne.id,
          },
        ),
      ).toMatchSnapshot();
    });
  });

  describe('orgId is undefined', () => {
    it("should get a contactAssignment for a person that is assigned to the current user's personal ministry", () => {
      expect(
        contactAssignmentSelector(
          // @ts-ignore
          { auth },
          {
            person: {
              reverse_contact_assignments: [
                {
                  assigned_to: {
                    id: auth.person.id,
                  },
                  organization: null,
                },
              ],
              organizational_permissions: [],
            },
            orgId: undefined,
          },
        ),
      ).toMatchSnapshot();
    });
  });

  describe('orgId is "personal"', () => {
    it("should get a contactAssignment for a person that is assigned to the current user's personal ministry", () => {
      expect(
        contactAssignmentSelector(
          // @ts-ignore
          { auth },
          {
            person: {
              reverse_contact_assignments: [
                {
                  assigned_to: {
                    id: auth.person.id,
                  },
                  organization: null,
                },
              ],
              organizational_permissions: [],
            },
            orgId: 'personal',
          },
        ),
      ).toMatchSnapshot();
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
