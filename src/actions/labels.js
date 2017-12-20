/* eslint-disable */
import { REQUESTS } from './api';
import callApi from './api';

export function getMyLabels() {
  return (dispatch) => {
    const query = {};
    // TODO: This endpoint doesn't exist. Need a way to get labels for searching
    return Promise.resolve();
    // return dispatch(callApi(REQUESTS.GET_MY_LABELS, query)).catch((error) => {
    //   LOG('error getting labels', error);
    // });
  };
}
