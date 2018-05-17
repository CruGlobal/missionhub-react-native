import { INTERACTION_TYPES, UPDATE_PEOPLE_INTERACTION_REPORT } from '../constants';

import callApi, { REQUESTS } from './api';

export function refreshImpact() {
  return (dispatch) => {
    dispatch(getImpactSummary('me'));
    return dispatch(getImpactSummary());
  };
}

export function getImpactSummary(personId, orgId) {
  return (dispatch) => {
    const query = { person_id: personId, organization_id: orgId };
    return dispatch(callApi(REQUESTS.GET_IMPACT_SUMMARY, query));
  };
}

export function getPeopleInteractionsReport(personId, organizationId, period) {
  return async(dispatch) => {
    const query = {
      people_ids: personId,
      organization_ids: organizationId,
      period,
    };
    const { response: [ report = {} ] } = personId ?
      await dispatch(callApi(REQUESTS.GET_PEOPLE_INTERACTIONS_REPORT, query)) :
      await dispatch(callApi(REQUESTS.GET_ORGANIZATION_INTERACTIONS_REPORT, query));

    const interactions = report ? report.interactions : [];
    const interactionReport = Object.values(INTERACTION_TYPES)
      .filter((type) => !type.hideReport)
      .map((type) => {
        if (type.requestFieldName) {
          return {
            ...type,
            num: report[ type.requestFieldName ] || 0,
          };
        }

        const interaction = interactions.find((i) => i.interaction_type_id === type.id) || {};
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
