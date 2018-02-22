import { THE_KEY_CLIENT_ID, LOGOUT, FIRST_TIME, ANALYTICS } from '../constants';
import { navigateReset, navigatePush } from './navigation';
import { getMe } from './people';
import { getStagesIfNotExists } from './stages';
import callApi, { REQUESTS } from './api';
import { updateAnalyticsContext } from './analytics';
import { onSuccessfulLogin } from './login';
import { LOGIN_SCREEN } from '../containers/LoginScreen';
import { LOGIN_OPTIONS_SCREEN } from '../containers/LoginOptionsScreen';

export function facebookLoginAction(accessToken, id, isUpgrade = false) {
  return (dispatch, getState) => {
    let data;
    const upgradeToken = getState().auth.token;
    if (isUpgrade) {
      data = {
        fb_access_token: accessToken,
        client_token: upgradeToken,
      };
    } else {
      data = {
        fb_access_token: accessToken,
      };
    }

    return dispatch(callApi(REQUESTS.FACEBOOK_LOGIN, {}, data)).then((results) => {
      LOG(results);
      dispatch(updateAnalyticsContext({ [ANALYTICS.FACEBOOK_ID]: id }));
      return dispatch(onSuccessfulLogin());
    });
  };
}

export function refreshAuth() {
  return async(dispatch, getState) => {
    const data = `grant_type=refresh_token&refresh_token=${getState().auth.refreshToken}`;

    await dispatch(callApi(REQUESTS.KEY_REFRESH_TOKEN, {}, data));
    dispatch(getKeyTicket());
  };
}

export function keyLogin(email, password) {
  const data = `grant_type=password&client_id=${THE_KEY_CLIENT_ID}&scope=fullticket%20extended&username=${email}&password=${password}`;

  return async(dispatch) => {
    await dispatch(callApi(REQUESTS.KEY_LOGIN, {}, data));
    await dispatch(getKeyTicket());

    return dispatch(onSuccessfulLogin());
  };
}

function getKeyTicket() {
  return async(dispatch) => {
    const keyTicketResult = await dispatch(callApi(REQUESTS.KEY_GET_TICKET, {}, {}));

    const data = { code: keyTicketResult.ticket };
    await dispatch(callApi(REQUESTS.TICKET_LOGIN, {}, data));
  };
}

export function logout() {
  return (dispatch) => {
    dispatch({ type: LOGOUT });
    dispatch(navigateReset(LOGIN_SCREEN));
  };
}

export function upgradeAccount() {
  return (dispatch) => {
    dispatch(navigatePush(LOGIN_OPTIONS_SCREEN, { upgradeAccount: true }));
  };
}

export function firstTime() {
  return (dispatch) => {
    dispatch({ type: FIRST_TIME });
  };
}

// export function mergeAccount() {
//   return (dispatch) => {
//     return dispatch(callApi(REQUESTS.PROMOTE_ACCOUNT, {}, data))
//   };
// }

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
