import { REQUESTS } from '../api/routes';

import callApi from './api';

export function getMyGroups() {
  // @ts-ignore
  return dispatch => {
    const query = {
      limit: 100,
    };
    return dispatch(callApi(REQUESTS.GET_MY_GROUPS, query));
  };
}
