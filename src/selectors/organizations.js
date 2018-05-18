import { createSelector } from 'reselect';

export const organizationSelector = createSelector(
  ({ organizations }) => organizations.all,
  (_, { orgId }) => orgId,
  (organizations, orgId) => organizations.find(org => org.id === orgId),
);

export const uncontactedSelector = createSelector(
  (_, { contacts }) => contacts,
  (_, { orgId }) => orgId,
  (contacts, orgId) =>
    contacts.filter(person => {
      const orgPermissions = person.organizational_permissions.find(
        o => o.organization_id === orgId,
      );
      return orgPermissions && orgPermissions.followup_status === 'uncontacted';
    }),
);

export const unassignedSelector = createSelector(
  (_, { contacts }) => contacts,
  (_, { orgId }) => orgId,
  (contacts, orgId) =>
    contacts.filter(person => person.reverse_contact_assignments.length === 0),
);
