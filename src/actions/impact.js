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