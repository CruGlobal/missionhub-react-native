import { REQUESTS } from './api';
import callApi from './api';

export function getMyGroups() {
  return (dispatch) => {
    const query = {};
    return dispatch(callApi(REQUESTS.GET_MY_GROUPS, query)).catch((error) => {
      LOG('error getting groups', error);
    });
  };
}
