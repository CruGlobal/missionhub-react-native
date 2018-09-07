import { createSelector } from 'reselect';

import { removeHiddenOrgs } from './selectorUtils';

export const peopleByOrgSelector = createSelector(
  ({ people }) => people.allByOrg,
  ({ auth }) => auth.person,
  (orgs, authUser) =>
    sortOrgs(removeHiddenOrgs(Object.values(orgs), authUser), authUser)
      .map(org => ({
        ...org,
        people: Object.values(org.people)
          .filter(person => isAssignedToMeInOrganization(person, org, authUser))
          .sort((a, b) => {
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
          }),
      }))
      .filter(o => o.people && (o.id === 'personal' || o.people.length > 0)),
);

const isAssignedToMeInOrganization = (person, org, appUserPerson) => {
  const { reverse_contact_assignments } = person;

  if (person.id === appUserPerson.id) {
    return true;
  }

  return (
    reverse_contact_assignments &&
    reverse_contact_assignments.filter(a => {
      const { assigned_to, organization } = a;

      return (
        assigned_to &&
        assigned_to.id === appUserPerson.id &&
        (!organization || organization.id === org.id)
      );
    }).length > 0
  );
};

const sortOrgs = (orgs, authUser) => {
  const orgOrder = authUser.user.organization_order;

  return orgOrder
    ? sortWithPersonalInFront(
        orgs,
        (a, b) => orgOrder.indexOf(a.id) > orgOrder.indexOf(b.id),
      )
    : sortWithPersonalInFront(
        orgs,
        (a, b) => (a.name ? a.name.localeCompare(b.name) : 1),
      );
};

const sortWithPersonalInFront = (orgs, sortFn) =>
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

export const personSelector = createSelector(
  ({ people }) => people.allByOrg,
  (_, { orgId }) => orgId,
  (_, { personId }) => personId,
  (orgs, orgId, personId) => {
    const org = orgs[orgId || 'personal'];
    return org && org.people[personId];
  },
);

export const contactAssignmentSelector = createSelector(
  (_, { person }) => person,
  (_, { orgId }) => orgId,
  ({ auth }) => auth.person.id,
  (person, orgId, authUserId) =>
    person.reverse_contact_assignments &&
    person.reverse_contact_assignments.find(
      assignment =>
        assignment.assigned_to &&
        assignment.assigned_to.id === authUserId &&
        (!assignment.organization || orgId === assignment.organization.id) &&
        (!orgId ||
          person.organizational_permissions.some(
            org_permission =>
              assignment.organization &&
              org_permission.organization_id === assignment.organization.id,
          )),
    ),
);

export const orgPermissionSelector = createSelector(
  (_, { person }) => person,
  (_, { organization }) => organization,
  (person, organization) =>
    organization &&
    (person.organizational_permissions || []).find(
      orgPermission => orgPermission.organization_id === organization.id,
    ),
);

export const contactsInOrgSelector = createSelector(
  ({ people }, { organization }) =>
    (people.allByOrg[organization.id] &&
      people.allByOrg[organization.id].people) ||
    {},
  (_, { organization }) => organization.contacts || [],
  (orgPeople, contactIds) => contactIds.map(i => orgPeople[i]),
);

export const contactsInSurveySelector = createSelector(
  ({ people }, { organization }) =>
    (people.allByOrg[organization.id] &&
      people.allByOrg[organization.id].people) ||
    {},
  (_, { organization, surveyId }) =>
    (organization.surveys &&
      organization.surveys[surveyId] &&
      organization.surveys[surveyId].contacts) ||
    [],
  (orgPeople, contactIds) => contactIds.map(i => orgPeople[i]),
);
