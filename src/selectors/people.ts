import { createSelector } from 'reselect';

import { PeopleState, Person } from '../reducers/people';
import { Organization, OrganizationsState } from '../reducers/organizations';
import { RootState } from '../reducers';
import { getAuthPerson } from '../auth/authUtilities';
import { AuthPerson_currentUser_person } from '../auth/__generated__/AuthPerson';

interface Org {
  id: string;
  people: Person[];
  name: string;
}

export const allAssignedPeopleSelector = createSelector(
  ({ people }: RootState) => people.people,
  ({
    organizations,
  }: {
    people: PeopleState;
    organizations: OrganizationsState;
  }) => organizations.all,
  () => getAuthPerson(),
  (people, orgs, authPerson) => {
    return Object.values(people)
      .filter((person: Person) =>
        isAssignedToMeInSomeOrganization(person, orgs, authPerson),
      )
      .sort((a, b) => sortPeople(a, b, authPerson));
  },
);

const isAssignedToMeInSomeOrganization = (
  person: Person,
  orgs: Organization[],
  me?: AuthPerson_currentUser_person,
) => {
  const { reverse_contact_assignments } = person;

  if (person.id === me?.id) {
    return true;
  }

  return (
    reverse_contact_assignments &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reverse_contact_assignments.some((a: any) => {
      const { assigned_to, organization } = a;

      return (
        assigned_to &&
        assigned_to.id === me?.id &&
        (!organization ||
          orgs.some(({ id }: { id: string }) => organization.id === id))
      );
    })
  );
};

const sortPeople = (a: Person, b: Person, authUser: Person) => {
  // Sort people in org by first name, then last name
  // Keep "ME" person in front
  if (a.id === authUser.id) {
    return -1;
  }
  if (b.id === authUser.id) {
    return 1;
  }
  return (
    a.first_name.localeCompare(b.first_name) ||
    a.last_name.localeCompare(b.last_name)
  );
};

export const personSelector = createSelector(
  ({ people }: { people: PeopleState }) => people.people,
  (_: { people: PeopleState }, { personId }: { personId?: string }) => personId,
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

export const selectOrgPermission = (
  person?: Person,
  organization?: Organization,
) =>
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
