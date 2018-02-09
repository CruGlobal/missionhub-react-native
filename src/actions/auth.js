import { THE_KEY_CLIENT_ID, LOGOUT, FIRST_TIME, ANALYTICS } from '../constants';
import { navigateReset } from './navigation';
import { getMe } from './people';
import { getStagesIfNotExists } from './stages';
import callApi, { REQUESTS } from './api';
import { updateAnalyticsContext } from './analytics';
import { onSuccessfulLogin } from './login';
import { LOGIN_SCREEN } from '../containers/LoginScreen';

export function facebookLoginAction(accessToken, id) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.FACEBOOK_LOGIN, {}, {
      fb_access_token: accessToken,
    })).then((results) => {
      LOG(results);
      dispatch(updateAnalyticsContext({ [ANALYTICS.FACEBOOK_ID]: id }));

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

    return dispatch(onSuccessfulLogin());
  };
}

export function logout() {
  return (dispatch) => {
    dispatch({ type: LOGOUT });
    dispatch(navigateReset(LOGIN_SCREEN));
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
    }
  };
}

export function loadHome() {
  return (dispatch) => {
    // TODO: Set this up so it only loads these if it hasn't loaded them in X amount of time
    dispatch(getMe());
    dispatch(getStagesIfNotExists());
    dispatch(updateTimezone());
  };
}
