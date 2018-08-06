import { createSelector } from 'reselect';

import { removeHiddenOrgs } from './selectorUtils';

export const organizationSelector = createSelector(
  ({ organizations }) => organizations.all,
  (_, { orgId }) => orgId,
  (organizations, orgId) => organizations.find(org => org.id === orgId),
);

export const allOrganizationsSelector = createSelector(
  ({ organizations }) => organizations.all,
  ({ auth }) => auth.person,
  (orgs, authUser) => removeHiddenOrgs(orgs, authUser),
);
