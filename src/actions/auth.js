import { THE_KEY_CLIENT_ID, LOGOUT, FIRST_TIME } from '../constants';
import { navigateReset } from './navigation';
import { getMe } from './people';
import { getStages } from './stages';
import callApi, { REQUESTS } from './api';
import { updateLoggedInStatus } from './analytics';
import { onSuccessfulLogin } from './login';

export function facebookLoginAction(accessToken) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.FACEBOOK_LOGIN, {}, {
      fb_access_token: accessToken,
    })).then((results) => {
      LOG(results);
      return dispatch(onSuccessfulLogin());
    });
  };
}

export function keyLogin(email, password) {
  const data = `grant_type=password&client_id=${THE_KEY_CLIENT_ID}&scope=fullticket%20extended&username=${email}&password=${password}`;

  return async(dispatch) => {
    await dispatch(callApi(REQUESTS.KEY_LOGIN, {}, data));

    return dispatch(getKeyTicket());
  };
}

function getKeyTicket() {
  return async(dispatch) => {
    const keyTicketResult = await dispatch(callApi(REQUESTS.KEY_GET_TICKET, {}, {}));

    const data = { code: keyTicketResult.ticket };
    await dispatch(callApi(REQUESTS.TICKET_LOGIN, {}, data));

    dispatch(updateLoggedInStatus(true));
    return dispatch(onSuccessfulLogin());
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

export function updateTimezone() {
  return (dispatch, getState) => {
    const currentTime = getState().auth.timezone;
    const timezone = new Date().getTimezoneOffset()/60*-1;
    if (currentTime !== `${timezone}`) {
      const data = {
        data: {
          attributes: {
            timezone: `${timezone}`,
          },
        },
      };
      return dispatch(callApi(REQUESTS.UPDATE_TIMEZONE, {}, data));
    } else return;
  };
}

export function loadHome() {
  return (dispatch) => {
    // TODO: Set this up so it only loads these if it hasn't loaded them in X amount of time
    dispatch(getMe());
    dispatch(getStages());
    dispatch(updateTimezone());
  };
}
