import callApi, { REQUESTS } from './api';

export function getStages() {
  return (dispatch) => {

    return dispatch(callApi(REQUESTS.GET_STAGES)).catch((error) => {
      LOG('error getting stages', error);
    });
  };
}