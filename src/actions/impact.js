import { REQUESTS } from './api';
import callApi from './api';

export function getGlobalImpact() {
  return (dispatch) => {
    const query = {};
    return dispatch(callApi(REQUESTS.GET_GLOBAL_IMPACT, query));
  };
}

export function getMyImpact() {
  return (dispatch) => {
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

export function getUserImpact(userId, period) {
  return (dispatch) => {
    const query = { people_ids: userId, period };
    return dispatch(callApi(REQUESTS.GET_USER_IMPACT, query));
  };
}
