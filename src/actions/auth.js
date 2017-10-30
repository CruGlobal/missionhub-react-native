import { LOGIN, LOGOUT } from '../constants';

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
