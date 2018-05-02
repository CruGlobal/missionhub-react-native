import callApi, { REQUESTS } from './api';
import { INTERACTION_TYPES, UPDATE_PEOPLE_INTERACTION_REPORT } from '../constants';

export function getGlobalImpact() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_GLOBAL_IMPACT));
  };
}

export function getMyImpact() {
  return (dispatch) => {
    const query = { person_id: 'me' };
    return dispatch(callApi(REQUESTS.GET_IMPACT_BY_ID, query));
  };
}

export function refreshImpact() {
  return (dispatch) => {
    dispatch(getMyImpact());
    return dispatch(getGlobalImpact());
  };
}

export function getImpactById(id) {
  return (dispatch) => {
    const query = { person_id: id };
    return dispatch(callApi(REQUESTS.GET_IMPACT_BY_ID, query));
  };
}

export function getPeopleInteractionsReport(personId, organizationId, period) {
  return async(dispatch) => {
    const query = {
      people_ids: personId,
      organization_ids: organizationId,
      period,
    };
    const { response: [ report = {} ] } = await dispatch(callApi(REQUESTS.GET_PEOPLE_INTERACTIONS_REPORT, query));

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
