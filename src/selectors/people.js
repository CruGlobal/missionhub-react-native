import { createSelector } from 'reselect';

export const peopleByOrgSelector = createSelector(
  ({ people }) => people.allByOrg,
  ({ auth }) => auth.user,
  (orgs, authUser) => Object.values(orgs)
    .map((org) => ({
      ...org,
      people: Object.values(org.people)
        .sort((a, b) => { // Sort people in org by first name, then last name
          // Keep "ME" person in front
          if (a.id === authUser.id) {
            return -1;
          }
          if (b.id === authUser.id) {
            return 1;
          }
          return a.first_name.localeCompare(b.first_name) || a.last_name.localeCompare(b.last_name);
        }),
    }))
    .sort((a, b) => { // Sort orgs by name
      // Keep Personal Ministry org in front
      if (a.id === 'personal') {
        return -1;
      }
      if (b.id === 'personal') {
        return 1;
      }
      return a.name.localeCompare(b.name);
    })
);
export const personSelector = createSelector(
  ({ people }) => people.allByOrg,
  (_, { orgId }) => orgId,
  (_, { personId }) => personId,
  (orgs, orgId, personId) => {
    const org = orgs[orgId || 'personal'];
    return org && org.people[personId];
  }
);

export const contactAssignmentSelector = createSelector(
  (_, { person }) => person,
  (_, __, { orgId }) => orgId,
  ({ auth }) => auth.personId,
  (person, orgId, authUserId) =>
    person.reverse_contact_assignments && person.reverse_contact_assignments
      .find((assignment) => assignment.assigned_to && assignment.assigned_to.id === authUserId
        && (!assignment.organization || orgId === assignment.organization.id)
        && (!orgId || person.organizational_permissions.some((org_permission) => org_permission.organization_id === assignment.organization.id)
        )
      )
);

export const orgPermissionSelector = createSelector(
  (_, { person }) => person,
  (_, { organization }) => organization,
  (person, organization) =>
    organization && person.organizational_permissions
      .find((orgPermission) => orgPermission.organization_id === organization.id)
);
