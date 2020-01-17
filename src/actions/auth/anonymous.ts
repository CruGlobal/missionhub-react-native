import callApi from '../api';
import { REQUESTS } from '../../api/routes';

import { authSuccess } from './userData';

export function codeLogin(code) {
  return async dispatch => {
    await dispatch(callApi(REQUESTS.CREATE_MY_PERSON, {}, { code }));
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
