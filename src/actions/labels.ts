import { REQUESTS } from '../api/routes';

import callApi from './api';

export function getMyLabels() {
  // @ts-ignore
  return dispatch => {
    const query = {
      limit: 100,
    };
    return dispatch(callApi(REQUESTS.GET_MY_LABELS, query));
  };
}

// @ts-ignore
export function getOrgFilterStats(organization_id) {
  // @ts-ignore
  return async dispatch => {
    const query = {
      organization_id,
    };
    const { response } = await dispatch(
      callApi(REQUESTS.GET_ORGANIZATION_FILTER_STATS, query),
    );
    return response;
  };
}
