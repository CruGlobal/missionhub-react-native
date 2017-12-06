import { REQUESTS } from './api';
import callApi from './api';

export function getMyOrganizations() {
  return (dispatch) => {
    const query = {};
    return dispatch(callApi(REQUESTS.GET_MY_ORGANIZATIONS, query)).catch((error) => {
      LOG('error getting orgs', error);
    });
  };
}