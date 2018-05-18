import {
  organizationSelector,
  uncontactedSelector,
  unassignedSelector,
} from '../../src/selectors/organizations';

const orgOne = { id: '95' };
const orgTwo = { id: '96' };

const orgId = '123';

const contacts = [
  {
    id: '1',
    organizational_permissions: [
      { organization_id: orgId, followup_status: 'contact_attempted' },
    ],
    reverse_contact_assignments: [],
  },
  {
    id: '2',
    organizational_permissions: [
      { organization_id: orgId, followup_status: 'uncontacted' },
    ],
    reverse_contact_assignments: [],
  },
  {
    id: '3',
    organizational_permissions: [
      { organization_id: orgId, followup_status: 'contact_attempted' },
    ],
    reverse_contact_assignments: [{ id: '23' }],
  },
  {
    id: '4',
    organizational_permissions: [
      { organization_id: orgId, followup_status: 'uncontacted' },
    ],
    reverse_contact_assignments: [{ id: '23' }],
  },
];

const organizations = {
  all: [orgOne, orgTwo],
};

it('should return org', () => {
  const result = organizationSelector({ organizations }, { orgId: orgTwo.id });

  expect(result).toEqual(orgTwo);
});

it('should not return an org when undefined is passed', () => {
  const result = organizationSelector({ organizations }, { orgId: undefined });

  expect(result).toBe(undefined);
});

it('should select uncontacted from contacts', () => {});

it('should select unassigned from contacts', () => {});
