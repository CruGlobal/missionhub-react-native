import { createSelector } from 'reselect';

import { PeopleState, Person, ContactAssignment } from '../reducers/people';
import { AuthState } from '../reducers/auth';
import { Organization } from '../reducers/organizations';

import { removeHiddenOrgs } from './selectorUtils';

interface Org {
  id: string;
  people: Person[];
  name: string;
}

export const peopleByOrgSelector = createSelector(
  ({ people }: { auth: AuthState; people: PeopleState }) => people.allByOrg,
  ({ auth }: { auth: AuthState; people: PeopleState }) => auth.person,
  (orgs, authPerson) =>
    sortOrgs(removeHiddenOrgs(Object.values(orgs), authPerson), authPerson)
      .map((org: Org) => ({
        ...org,
        people: Object.values(org.people)
          .filter(person =>
            isAssignedToMeInOrganization(person, org, authPerson),
          )
          .sort((a, b) => sortPeople(a, b, authPerson)),
      }))
      .filter(
        (o: Org) => o.people && (o.id === 'personal' || o.people.length > 0),
      ),
);

export const allAssignedPeopleSelector = createSelector(
  ({ people }: { auth: AuthState; people: PeopleState }) => people.allByOrg,
  ({ auth }: { auth: AuthState; people: PeopleState }) => auth.person,
  (orgs, authUser) => {
    const allPeople: { [key: string]: Person } = {};
    removeHiddenOrgs(Object.values(orgs), authUser).forEach((org: Org) => {
      Object.values(org.people)
        .filter((person: Person) =>
          isAssignedToMeInOrganization(person, org, authUser),
        )
        .forEach((person: Person) => {
          allPeople[person.id] = {
            ...(allPeople[person.id] || {}),
            ...person,
          };
        });
    });
    return (Object.values(allPeople) || []).sort((a, b) =>
      sortPeople(a, b, authUser),
    );
  },
);

const isAssignedToMeInOrganization = (
  person: Person,
  org: Org,
  appUserPerson: Person,
) => {
  const { reverse_contact_assignments } = person;

  if (person.id === appUserPerson.id && org.id === 'personal') {
    return true;
  }

  return (
    reverse_contact_assignments &&
    reverse_contact_assignments.filter((a: ContactAssignment) => {
      const { assigned_to, organization } = a;

      return (
        assigned_to &&
        assigned_to.id === appUserPerson.id &&
        (!organization || organization.id === org.id)
      );
    }).length > 0
  );
};

const sortOrgs = (orgs: Organization[], authPerson: Person) => {
  const orgOrder = authPerson.user && authPerson.user.organization_order;

  return orgOrder
    ? sortWithPersonalInFront(orgs, (a, b) =>
        orgOrder.indexOf(a.id) > orgOrder.indexOf(b.id) ? 1 : -1,
      )
    : sortWithPersonalInFront(orgs, (a, b) =>
        a.name ? a.name.localeCompare(b.name) : 1,
      );
};

const sortWithPersonalInFront = (
  orgs: Organization[],
  sortFn: (a: Organization, b: Organization) => number,
) =>
  orgs.sort((a, b) => {
    // Sort orgs by name
    // Keep Personal Ministry org in front
    if (a.id === 'personal') {
      return -1;
    }
    if (b.id === 'personal') {
      return 1;
    }
    return sortFn(a, b);
  });

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
  ({ people }: { people: PeopleState }) => people.allByOrg,
  (
    _: { people: PeopleState },
    { orgId }: { personId: string; orgId?: string },
  ) => orgId,
  (
    _: { people: PeopleState },
    { personId }: { personId: string; orgId?: string },
  ) => personId,
  (orgs, orgId, personId) => {
    const org = orgs[orgId || 'personal'];
    return org && org.people[personId];
  },
);

export const contactAssignmentSelector = createSelector(
  (_: { auth: AuthState }, { person }: { person: Person; orgId?: string }) =>
    person || {},
  (_: { auth: AuthState }, { orgId }: { person: Person; orgId?: string }) =>
    orgId,
  ({ auth }: { auth: AuthState }) => auth.person.id,
  (person, orgId, authUserId) => {
    const {
      reverse_contact_assignments = [],
      organizational_permissions = [],
    } = person;

    return reverse_contact_assignments.find(
      assignment =>
        assignment.assigned_to.id === authUserId &&
        (!orgId || orgId === 'personal'
          ? !assignment.organization
          : assignment.organization &&
            orgId === assignment.organization.id &&
            organizational_permissions.some(
              org_permission =>
                org_permission.organization_id === assignment.organization.id,
            )),
    );
  },
);

export const orgPermissionSelector = createSelector(
  (_: {}, { person }: { person: Person; organization: Organization }) => person,
  (_: {}, { organization }: { person: Person; organization: Organization }) =>
    organization,
  (person, organization) =>
    organization &&
    (person.organizational_permissions || []).find(
      orgPermission => orgPermission.organization_id === organization.id,
    ),
);
