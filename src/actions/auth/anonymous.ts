import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { RootState } from '../../reducers';

import { authSuccess } from './userData';

export function codeLogin(code: string) {
  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    await dispatch(callApi(REQUESTS.CREATE_MY_PERSON, {}, { code }));
    dispatch(authSuccess());
  };
}

export function refreshAnonymousLogin() {
  return (
    dispatch: ThunkDispatch<RootState, never, AnyAction>,
    getState: () => RootState,
  ) => {
    const { upgradeToken } = getState().auth;

    return dispatch(
      callApi(REQUESTS.REFRESH_ANONYMOUS_LOGIN, {}, { code: upgradeToken }),
    );
  };
}
