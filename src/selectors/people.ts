import { createSelector } from 'reselect';

import { PeopleState, Person } from '../reducers/people';
import { AuthState } from '../reducers/auth';
import { Organization } from '../reducers/organizations';
import { CelebrateItem_subjectPerson_communityPermissions_nodes as CommunityPermission } from '../components/CelebrateItem/__generated__/CelebrateItem';

import { removeHiddenOrgs } from './selectorUtils';

interface Org {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  people: Person[];
  name: string;
}

export const peopleByOrgSelector = createSelector(
  ({ people }: { auth: AuthState; people: PeopleState }) => people.allByOrg,
  ({ auth }: { auth: AuthState; people: PeopleState }) => auth.person,
  (orgs, authUser) =>
    sortOrgs(removeHiddenOrgs(Object.values(orgs), authUser), authUser)
      .map((org: Org) => ({
        ...org,
        people: Object.values(org.people)
          .filter(person => isAssignedToMeInOrganization(person, org, authUser))
          .sort((a, b) => sortPeople(a, b, authUser)),
      }))
      .filter(
        (o: Org) => o.people && (o.id === 'personal' || o.people.length > 0),
      ),
);

export const allAssignedPeopleSelector = createSelector(
  ({ people }: { auth: AuthState; people: PeopleState }) => people.allByOrg,
  ({ auth }: { auth: AuthState; people: PeopleState }) => auth.person,
  (orgs, authUser) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allPeople: any = {};
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reverse_contact_assignments.filter((a: any) => {
      const { assigned_to, organization } = a;

      return (
        assigned_to &&
        assigned_to.id === appUserPerson.id &&
        (!organization || organization.id === org.id)
      );
    }).length > 0
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sortOrgs = (orgs: any, authUser: Person) => {
  const orgOrder = authUser.user.organization_order;

  return orgOrder
    ? sortWithPersonalInFront(
        orgs,
        (a: Org, b: Org) => orgOrder.indexOf(a.id) > orgOrder.indexOf(b.id),
      )
    : sortWithPersonalInFront(orgs, (a: Org, b: Org) =>
        a.name ? a.name.localeCompare(b.name) : 1,
      );
};

const sortWithPersonalInFront = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orgs: any,
  sortFn: (a: Org, b: Org) => boolean | number,
) =>
  orgs.sort((a: Org, b: Org) => {
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
      (assignment: {
        assigned_to?: { id: string };
        organization?: { id: string };
      }) =>
        assignment.assigned_to &&
        assignment.assigned_to.id === authUserId &&
        (!orgId || orgId === 'personal'
          ? !assignment.organization
          : assignment.organization &&
            orgId === assignment.organization.id &&
            organizational_permissions.some(
              (org_permission: { organization_id: string }) =>
                org_permission.organization_id ===
                (assignment.organization && assignment.organization.id),
            )),
    );
  },
);

export const orgPermissionSelector = createSelector(
  (_: {}, { person }: { person: Person; organization: Organization }) => person,
  (_: {}, { organization }: { person: Person; organization: Organization }) =>
    organization,
  (person, organization) =>
    organization && person.organizational_permissions
      ? (person.organizational_permissions || []).find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (orgPermission: any) =>
            orgPermission.organization_id === organization.id,
        )
      : (
          (person.communityPermissions && person.communityPermissions.nodes) ||
          []
        ).find(
          (orgPermission: CommunityPermission) =>
            orgPermission.community.id === organization.id,
        ),
);
