import { createSelector } from 'reselect';

import { Person } from '../reducers/people';
import { Organization } from '../reducers/organizations';
import { RootState } from '../reducers';
import { getAuthPerson } from '../auth/authUtilities';

export const personSelector = createSelector(
  ({ people }: RootState) => people.people,
  (_: RootState, { personId }: { personId?: string }) => personId,
  (people, personId) => {
    return personId ? people[personId] : undefined;
  },
);

export const contactAssignmentSelector = createSelector(
  ({ person }: { person: Person }) => person || {},
  () => getAuthPerson().id,
  (person, authUserId) => selectContactAssignment(person, authUserId),
);

export const selectContactAssignment = (
  person: Person,
  authUserId?: string,
) => {
  const { reverse_contact_assignments = [] } = person;

  // Just return the first one found regardless of org since after the split there will only be one and we will have dropped org ids. There is an edge case where the same user is assigned to you in 2 orgs but we are ok breaking that since it has such little usage.
  return reverse_contact_assignments.find(
    (assignment: { assigned_to?: { id: string } }) =>
      assignment.assigned_to?.id === authUserId,
  );
};

export const orgPermissionSelector = createSelector(
  (
    _: Record<string, unknown>,
    { person }: { person: Person; organization: Organization },
  ) => person,
  (
    _: Record<string, unknown>,
    { organization }: { person: Person; organization: Organization },
  ) => organization,
  (person, organization) => selectOrgPermission(person, organization),
);

const selectOrgPermission = (person?: Person, organization?: Organization) =>
  organization && person?.organizational_permissions
    ? (person.organizational_permissions || []).find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (orgPermission: any) =>
          orgPermission.organization_id === organization.id,
      )
    : (person?.communityPermissions?.nodes || []).find(
        (orgPermission: { community: { id: string } }) =>
          orgPermission.community.id === organization.id,
      );
