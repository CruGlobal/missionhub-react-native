import { createSelector } from 'reselect';

import { PeopleState, Person } from '../reducers/people';
import { AuthState } from '../reducers/auth';
import { Organization, OrganizationsState } from '../reducers/organizations';

import { removeHiddenOrgs } from './selectorUtils';

interface Org {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  people: Person[];
  name: string;
}

export const allAssignedPeopleSelector = createSelector(
  ({ people }: { auth: AuthState; people: PeopleState }) => people.people,
  ({
    organizations,
  }: {
    auth: AuthState;
    people: PeopleState;
    organizations: OrganizationsState;
  }) => organizations.all,
  ({ auth }: { auth: AuthState; people: PeopleState }) => auth.person,
  (people, orgs, authUser) => {
    return Object.values(people)
      .filter((person: Person) =>
        isAssignedToMeInSomeOrganization(person, orgs, authUser),
      )
      .sort((a, b) => sortPeople(a, b, authUser));
  },
);

const isAssignedToMeInSomeOrganization = (
  person: Person,
  orgs: Organization[],
  me: Person,
) => {
  const { reverse_contact_assignments } = person;

  if (person.id === me.id) {
    return true;
  }

  const visibleOrgs = removeHiddenOrgs(orgs, me);

  return (
    reverse_contact_assignments &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reverse_contact_assignments.some((a: any) => {
      const { assigned_to, organization } = a;

      return (
        assigned_to &&
        assigned_to.id === me.id &&
        (!organization ||
          visibleOrgs.some(({ id }: { id: string }) => organization.id === id))
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
  (_: { people: PeopleState }, { personId }: { personId: string }) => personId,
  (people, personId) => {
    return people[personId];
  },
);

export const contactAssignmentSelector = createSelector(
  (_: { auth: AuthState }, { person }: { person: Person; orgId?: string }) =>
    person || {},
  (_: { auth: AuthState }, { orgId }: { person: Person; orgId?: string }) =>
    orgId,
  ({ auth }: { auth: AuthState }) => auth.person.id,
  (person, orgId, authUserId) =>
    selectContactAssignment(person, authUserId, orgId),
);

export const selectContactAssignment = (
  person: Person,
  authUserId: string,
  orgId?: string,
) => {
  const {
    reverse_contact_assignments = [],
    organizational_permissions = [],
  } = person;

  return reverse_contact_assignments.find(
    (assignment: {
      assigned_to?: { id: string };
      organization?: { id: string };
    }) =>
      assignment.assigned_to?.id === authUserId &&
      (!orgId || orgId === 'personal'
        ? !assignment.organization
        : orgId === assignment.organization?.id &&
          organizational_permissions.some(
            (org_permission: { organization_id: string }) =>
              org_permission.organization_id === assignment.organization?.id,
          )),
  );
};

export const orgPermissionSelector = createSelector(
  (_: {}, { person }: { person: Person; organization: Organization }) => person,
  (_: {}, { organization }: { person: Person; organization: Organization }) =>
    organization,
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
