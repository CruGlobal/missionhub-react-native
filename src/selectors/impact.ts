import { createSelector } from 'reselect';

// @ts-ignore
const personIdSelector = (_, { person = {} } = {}) => person.id || '';
// @ts-ignore
const orgIdSelector = (_, { organization = {} } = {}) => organization.id || '';

export const impactSummarySelector = createSelector(
  ({ impact }) => impact.summary,
  personIdSelector,
  orgIdSelector,
  (summary, personId, orgId) => summary[`${personId}-${orgId}`] || {},
);

export const impactInteractionsSelector = createSelector(
  ({ impact }) => impact.interactions,
  personIdSelector,
  orgIdSelector,
  (interactions, personId, orgId) => interactions[`${personId}-${orgId}`] || {},
);
