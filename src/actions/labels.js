import { REQUESTS } from './api';
import callApi from './api';

export function getMyLabels() {
  return (dispatch) => {
    const query = {
      limit: 100,
    };
    return dispatch(callApi(REQUESTS.GET_MY_LABELS, query));
  };
}
