import { createSelector } from 'reselect';

const personIdSelector = (_, { person = {} } = {}) => person.id || '';
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
