import { REQUESTS } from './api';
import callApi from './api';

export function getMyLabels() {
  return dispatch => {
    const query = {
      limit: 100,
    };
    return dispatch(callApi(REQUESTS.GET_MY_LABELS, query));
  };
}

export function getOrgLabels(orgId) {
  return dispatch => {
    const query = {
      orgId,
      limit: 100,
      include: 'labels',
    };
    return dispatch(callApi(REQUESTS.GET_ORGANIZATION_LABELS, query));
  };
}
