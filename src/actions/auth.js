import { LOGIN, LOGOUT, FIRST_TIME } from '../constants';
import { navigateReset } from './navigation';

export function login() {
  return (dispatch) => {
    dispatch({ type: LOGIN });
  };
}

export function logout() {
  return (dispatch) => {
    dispatch({ type: LOGOUT });
    dispatch(navigateReset('Login'));
  };
}

export function firstTime() {
  return (dispatch) => {
    dispatch({ type: FIRST_TIME });
  };
}