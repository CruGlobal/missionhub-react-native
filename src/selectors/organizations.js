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

export const communitiesSelector = createSelector(
  ({ organizations }) => organizations.all,
  ({ auth }) => auth.person,
  (orgs, authUser) =>
    removeHiddenOrgs(orgs, authUser)
      .filter(org => org.community)
      // Make sure communities always have a contactReport object
      .map(o => ({ ...o, contactReport: o.contactReport || {} })),
);
