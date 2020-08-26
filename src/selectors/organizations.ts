import { createSelector } from 'reselect';

import { RootState } from '../reducers';

export const organizationSelector = createSelector(
  ({ organizations }: RootState) => organizations.all,
  (_: RootState, { orgId }: { orgId: string }) => orgId,
  (organizations, orgId) =>
    (organizations || []).find(org => org.id === orgId) || { id: orgId },
);
