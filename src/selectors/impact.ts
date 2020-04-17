import { createSelector } from 'reselect';

import { Person } from '../reducers/people';
import { Organization } from '../reducers/organizations';
import { ImpactState } from '../reducers/impact';

const personIdSelector = (
  _: unknown,
  { person = {} }: { person?: Person } = {},
) => person.id || '';
const orgIdSelector = (
  _: unknown,
  { organization = {} }: { organization?: Organization } = {},
) => organization.id || '';

export const impactSummarySelector = createSelector(
  ({ impact }: { impact: ImpactState }) => impact.summary,
  personIdSelector,
  orgIdSelector,
  (summary, personId, orgId) => summary[`${personId}-${orgId}`] || {},
);

export const impactInteractionsSelector = createSelector(
  ({ impact }: { impact: ImpactState }) => impact.interactions,
  personIdSelector,
  orgIdSelector,
  (interactions, personId, orgId) => interactions[`${personId}-${orgId}`] || {},
);
