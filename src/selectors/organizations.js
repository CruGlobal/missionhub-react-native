import { createSelector } from 'reselect';

export const organizationSelector = createSelector(
  ({ organizations }) => organizations.all,
  (_, { orgId }) => orgId,
  (organizations, orgId) => organizations.find(org => org.id === orgId),
);
