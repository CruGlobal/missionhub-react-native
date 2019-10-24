import { createSelector } from 'reselect';

import { OrganizationsState, Organization } from '../reducers/organizations';
import { AuthState } from '../reducers/auth';

import { removeHiddenOrgs } from './selectorUtils';

export const organizationSelector = createSelector(
  ({ organizations }: { organizations: OrganizationsState }) =>
    organizations.all,
  (_: { organizations: OrganizationsState }, { orgId }: { orgId: string }) =>
    orgId,
  (organizations, orgId) =>
    (organizations || []).find(org => org.id === orgId) || { id: orgId },
);

export const allOrganizationsSelector = createSelector(
  ({ organizations }) => organizations.all,
  ({ auth }) => auth.person,
  (orgs, authUser) => removeHiddenOrgs(orgs, authUser),
);

export const communitiesSelector = createSelector(
  ({ organizations }: { organizations: OrganizationsState }) =>
    organizations.all,
  ({ auth }: { auth: AuthState }) => auth.person,
  (orgs, authUser) =>
    removeHiddenOrgs(orgs, authUser)
      .filter((org: Organization) => org.community)
      // Make sure communities always have a contactReport object
      .map((org: Organization) => ({
        ...org,
        contactReport: org.contactReport || {},
      })),
);
