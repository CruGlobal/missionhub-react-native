import { LOGOUT, FIRST_TIME } from '../constants';
import { navigateReset } from './navigation';
import { clearAllScheduledNotifications } from './notifications';
import callApi, {REQUESTS} from './api';

export function keyLogin(username, password) {
  const data = 'grant_type=password&client_id=8480288430352167964&scope=fullticket%20extended&username=' + username + '&password=' + password;

  return (dispatch) => {
    return dispatch(callApi(REQUESTS.KEY_LOGIN, {}, data))
      .then(response => {
        return dispatch(getKeyTicket(response.access_token));
      })
      .catch((error) => {
        LOG('error logging in', error);
      });
  };
}

function getKeyTicket() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.KEY_GET_TICKET, {}, {}))
      .then(response => {
        return dispatch(loginWithTicket(response.ticket));
      })
      .catch((error) => {
        LOG('error getting ticket', error);
      });
  };
}

function loginWithTicket(ticket) {
  const data = {
    code: ticket,
  };

  return (dispatch) => {
    return dispatch(callApi(REQUESTS.TICKET_LOGIN, {}, data))
      .catch((error) => {
        LOG('error logging in with ticket', error);
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