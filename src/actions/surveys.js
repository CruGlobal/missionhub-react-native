import { REQUESTS } from './api';
import callApi from './api';

export function getMySurveys() {
  return (dispatch) => {
    const query = {};
    return dispatch(callApi(REQUESTS.GET_MY_SURVEYS, query)).catch((error) => {
      LOG('error getting surveys', error);
    });
  };
}
