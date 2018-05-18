import {
  peopleByOrgSelector,
  personSelector,
  contactAssignmentSelector,
  orgPermissionSelector,
} from '../../src/selectors/people';

const auth = {
  person: {
    id: '23',
  },
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
    },
    '31': {
      id: '31',
      type: 'person',
      first_name: 'Fname3',
      last_name: 'Lname3',
    },
    '32': {
      id: '32',
      type: 'person',
      first_name: 'Fname3',
      last_name: 'Lname1',
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
    },
  },
};

const people = {
  allByOrg: {
    personal: {
      id: 'personal',
      type: 'organization',
      people: {
        '20': {
          id: '20',
          type: 'person',
          first_name: 'Fname2',
          last_name: 'Lname',
        },
        '21': {
          id: '21',
          type: 'person',
          first_name: 'Fname1',
          last_name: 'Lname2',
        },
        '22': {
          id: '22',
          type: 'person',
          first_name: 'Fname1',
          last_name: 'Lname1',
        },
        [auth.person.id]: {
          id: auth.person.id,
          type: 'person',
          first_name: 'ME',
          last_name: 'Lname',
        },
      },
    },
    [unnamedOrganization.id]: unnamedOrganization,
    [organizationOne.id]: organizationOne,
    [organizationTwo.id]: organizationTwo,
  },
};

describe('peopleByOrgSelector', () => {
  it('should take the allByOrg object and transform it to sorted arrays', () => {
    expect(peopleByOrgSelector({ people, auth })).toMatchSnapshot();
  });
});

describe('personSelector', () => {
  it('should get a person in the personal org', () => {
    expect(
      personSelector({ people }, { orgId: null, personId: '22' }),
    ).toMatchSnapshot();
  });
  it('should get a person in another org', () => {
    expect(
      personSelector({ people }, { orgId: organizationOne.id, personId: '31' }),
    ).toMatchSnapshot();
  });
});

describe('contactAssignmentSelector', () => {
  const organizationOne = { id: '100' };
  const organizationTwo = { id: '101' };

  it("should get a person's contactAssignment for that is assigned to the current user's org ministry", () => {
    expect(
      contactAssignmentSelector(
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

  it("should get a person's contactAssignment for that is assigned to the current user's personal ministry", () => {
    expect(
      contactAssignmentSelector(
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
});
