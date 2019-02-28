import callApi, { REQUESTS } from '../api';

import { authSuccess } from './userData';
import { firstTime } from './userData';

export function codeLogin(code) {
  return async dispatch => {
    await dispatch(callApi(REQUESTS.CREATE_MY_PERSON, {}, { code }));
    // Make sure this is set to FIRST_TIME so we know we're in the tryItNow flow
    dispatch(firstTime());
    dispatch(authSuccess());
  };
}

export function refreshAnonymousLogin() {
  return (dispatch, getState) => {
    const { upgradeToken } = getState().auth;

    return dispatch(
      callApi(REQUESTS.REFRESH_ANONYMOUS_LOGIN, {}, { code: upgradeToken }),
    );
  };
}
