import { THE_KEY_CLIENT_ID, LOGOUT, FIRST_TIME, LOGIN_WITH_MINISTRIES } from '../constants';
import { navigateReset } from './navigation';
import { getMe } from './people';
import { getStages } from './stages';
import { clearAllScheduledNotifications, setupPushNotifications } from './notifications';
import callApi, { REQUESTS } from './api';
import { updateLoggedInStatus } from './analytics';

export function keyLogin(email, password) {
  const data = `grant_type=password&client_id=${THE_KEY_CLIENT_ID}&scope=fullticket%20extended&username=${email}&password=${password}`;

  return async(dispatch) => {
    await dispatch(callApi(REQUESTS.KEY_LOGIN, {}, data));

    return dispatch(getKeyTicket());
  };
}


export function facebookLoginAction(accessToken) {
  // LOG('access token for fb', accessToken);
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.FACEBOOK_LOGIN, {}, {
      fb_access_token: accessToken,
    })).then((results) => {
      LOG(results);
      // dispatch(loginAction(results.access_token, results));
      // dispatch(messagesAction());
      // Do something with the results
      return results;
    }).catch((error) => {
      LOG('error logging in', error);
    });
  };
}

function getKeyTicket() {
  return async(dispatch) => {
    const keyTicketResult = await dispatch(callApi(REQUESTS.KEY_GET_TICKET, {}, {}));

    const data = { code: keyTicketResult.ticket };
    await dispatch(callApi(REQUESTS.TICKET_LOGIN, {}, data));

    dispatch(updateLoggedInStatus(true));
    return dispatch(getMe());
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

export function loadHome() {
  return (dispatch) => {
    // TODO: Set this up so it only loads these if it hasn't loaded them in X amount of time
    dispatch(setupPushNotifications());
    dispatch(getMe());
    dispatch(getStages());
  };
}
