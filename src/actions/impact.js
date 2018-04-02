import { REQUESTS } from './api';
import callApi from './api';

export function getGlobalImpact() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_GLOBAL_IMPACT));
  };
}

export function getMyImpact() {
  return (dispatch) => {
    console.log('here');
    const query = { person_id: 'me' };
    return dispatch(callApi(REQUESTS.GET_MY_IMPACT, query));
  };
}

export function getImpactById(id) {
  return (dispatch) => {
    const query = { person_id: id };
    return dispatch(callApi(REQUESTS.GET_IMPACT_BY_ID, query));
  };
}

export function getUserImpact(userId, organizationId, period) {
  return (dispatch) => {
    const query = {
      people_ids: userId,
      organization_ids: organizationId,
      period,
    };
    return dispatch(callApi(REQUESTS.GET_USER_IMPACT, query));
  };
}
