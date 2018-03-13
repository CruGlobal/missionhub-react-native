import { createSelector } from 'reselect';

export const orgSelector = createSelector(
  ({ organizations }) => organizations.all,
  (_, { orgId }) => orgId,
  (organizations, orgId) => organizations.find((org) => org.id === orgId),
);
