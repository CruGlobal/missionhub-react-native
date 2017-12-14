import { LOGIN, LOGOUT, FIRST_TIME, LOGIN_WITH_MINISTRIES } from '../constants';
import { navigateReset } from './navigation';
import { clearAllScheduledNotifications } from './notifications';

export function login() {
  return (dispatch) => {
    dispatch({ type: LOGIN });
  };
}

export function loginWithMinistries() {
  return (dispatch) => {
    dispatch({ type: LOGIN_WITH_MINISTRIES });
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