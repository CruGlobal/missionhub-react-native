import { REQUESTS } from './api';
import callApi from './api';

export function getMySurveys() {
  return (dispatch) => {
    const query = {
      limit: 100,
    };
    return dispatch(callApi(REQUESTS.GET_MY_SURVEYS, query));
  };
}
