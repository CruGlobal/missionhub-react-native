import { LOGIN, LOGOUT, FIRST_TIME } from '../constants';

export function login() {
  return (dispatch) => {
    dispatch({ type: LOGIN });
  };
}

export function logout() {
  return (dispatch) => {
    dispatch({ type: LOGOUT });
  };
}

export function firstTime() {
  return (dispatch) => {
    dispatch({ type: FIRST_TIME });
  };
}