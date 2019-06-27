import { REQUESTS } from '../api/routes';

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
  return async dispatch => {
    const query = {
      orgId,
      include: 'labels',
    };
    const { response } = await dispatch(
      callApi(REQUESTS.GET_ORGANIZATION_LABELS, query),
    );
    return response.labels;
  };
}
