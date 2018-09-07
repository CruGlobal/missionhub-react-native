import { createSelector } from 'reselect';

export const surveysInOrgSelector = createSelector(
  ({ surveys }, { organization }) =>
    (surveys.allByOrg[organization.id] &&
      surveys.allByOrg[organization.id].surveys) ||
    {},
  (_, { organization }) => organization.surveys || [],
  (orgSurveys, surveyIds) =>
    surveyIds.map(i => orgSurveys[i]).filter(s => !s._placeHolder),
);
// organizations may have _placeholder surveys until the mounting request is completed
