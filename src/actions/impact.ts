import {
  INTERACTION_TYPES,
  UPDATE_PEOPLE_INTERACTION_REPORT,
} from '../constants';
import { REQUESTS } from '../api/routes';

import callApi from './api';

// @ts-ignore
export function refreshImpact(orgId) {
  // @ts-ignore
  return dispatch => {
    // @ts-ignore
    dispatch(getImpactSummary('me'));
    if (orgId) {
      dispatch(getImpactSummary(undefined, orgId));
    }
    // @ts-ignore
    return dispatch(getImpactSummary());
  };
}

// @ts-ignore
export function getImpactSummary(personId, orgId) {
  // @ts-ignore
  return dispatch => {
    const query = { person_id: personId, organization_id: orgId };
    return dispatch(callApi(REQUESTS.GET_IMPACT_SUMMARY, query));
  };
}

// @ts-ignore
export function getPeopleInteractionsReport(personId, organizationId, period) {
  // @ts-ignore
  return async dispatch => {
    const query = {
      people_ids: personId,
      organization_ids: organizationId,
      period,
    };
    const {
      response: [report = {}],
    } = personId
      ? await dispatch(callApi(REQUESTS.GET_PEOPLE_INTERACTIONS_REPORT, query))
      : await dispatch(
          callApi(REQUESTS.GET_ORGANIZATION_INTERACTIONS_REPORT, query),
        );

    const interactions = report ? report.interactions || [] : [];
    const interactionReport = Object.values(INTERACTION_TYPES)
      // @ts-ignore
      .filter(type => !type.hideReport)
      .map(type => {
        // @ts-ignore
        if (type.requestFieldName) {
          return {
            ...type,
            // @ts-ignore
            num: report[type.requestFieldName] || 0,
          };
        }

        const interaction =
          // @ts-ignore
          interactions.find(i => `${i.interaction_type_id}` === type.id) || {};
        return {
          ...type,
          num: interaction.interaction_count || 0,
        };
      });

    return dispatch({
      type: UPDATE_PEOPLE_INTERACTION_REPORT,
      personId,
      organizationId,
      period,
      report: interactionReport,
    });
  };
}
