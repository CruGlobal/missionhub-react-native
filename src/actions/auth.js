import { LOGOUT, FIRST_TIME } from '../constants';
import { navigateReset } from './navigation';
import { clearAllScheduledNotifications } from './notifications';
import callApi, {REQUESTS} from './api';

export function keyLogin(username, password) {
  const data = {
    username: username,
    password: password,
    grant_type: 'password',
    client_id: 8480288430352167964, //TODO put somewhere else?
    scope: 'extended fullticket',
  };

  return (dispatch) => {
    return dispatch(callApi(REQUESTS.KEY_LOGIN, {}, data)).catch((error) => {
      LOG('error logging in', error);
    });
  };
}

export function logout() {
  return (dispatch) => {
    dispatch({ type: LOGOUT });
    dispatch(navigateReset('Login'));
    dispatch(clearAllScheduledNotifications());
  };
}

export function firstTime() {
  return (dispatch) => {
    dispatch({ type: FIRST_TIME });
  };
}