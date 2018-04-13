import { THE_KEY_CLIENT_ID, LOGOUT, FIRST_TIME, OPEN_URL } from '../constants';
import { navigateReset, navigatePush } from './navigation';
import { getMe } from './person';

import { reregisterNotificationHandler, deletePushToken } from './notifications';
import { getStagesIfNotExists } from './stages';
import callApi, { REQUESTS } from './api';
import { logOutAnalytics } from './analytics';
import { onSuccessfulLogin } from './login';
import { LOGIN_SCREEN } from '../containers/LoginScreen';
import { LOGIN_OPTIONS_SCREEN } from '../containers/LoginOptionsScreen';
import base64url from 'base64-url';
import { sha256 } from 'js-sha256';
import { Linking } from 'react-native';
import Buffer from 'buffer';
import { THE_KEY_URL } from '../api/utils';
import randomString from 'random-string';
import { getAssignedOrganizations } from './organizations';
import i18next from 'i18next';

export function openKeyURL(baseURL, onReturn, upgradeAccount = false) {
  return (dispatch) => {
    global.Buffer = global.Buffer || Buffer.Buffer;

    const string = randomString({ length: 50, numeric: true, letters: true, special: false });
    const codeVerifier = base64url.encode(string);
    const codeChallenge = base64url.encode(sha256.array(codeVerifier));
    const redirectUri = 'https://missionhub.com/auth';

    const uri = `${THE_KEY_URL}${baseURL}&client_id=${THE_KEY_CLIENT_ID}&response_type=code`
      + `&redirect_uri=${redirectUri}&scope=fullticket%20extended&code_challenge_method=S256`
      + `&code_challenge=${codeChallenge}`;

    Linking.addEventListener('url', (event) => {
      const code = event.url.split('code=')[1];
      onReturn();
      return dispatch(createAccountAndLogin(code, codeVerifier, redirectUri, upgradeAccount ? upgradeAccount : null));
    });

    Linking.openURL(uri);
    return dispatch({ type: OPEN_URL });
  };
}

export function createAccountAndLogin(code, verifier, redirectUri, isUpgrade) {
  const data = `grant_type=authorization_code&client_id=${THE_KEY_CLIENT_ID}&code=${code}&code_verifier=${verifier}&redirect_uri=${redirectUri}`;
  return getTokenAndLogin(data, isUpgrade);
}

export function refreshAccessToken() {
  return async(dispatch, getState) => {
    const data = `grant_type=refresh_token&refresh_token=${getState().auth.refreshToken}`;

    await dispatch(callApi(REQUESTS.KEY_REFRESH_TOKEN, {}, data));
    dispatch(getTicketAndLogin());
  };
}

export function keyLogin(email, password, isUpgrade = false) {
  const data = `grant_type=password&client_id=${THE_KEY_CLIENT_ID}&scope=fullticket%20extended&username=${email}&password=${password}`;
  return getTokenAndLogin(data, isUpgrade);
}

function getTokenAndLogin(data, isUpgrade) {
  return async(dispatch) => {
    await dispatch(callApi(REQUESTS.KEY_LOGIN, {}, data));
    await dispatch(getTicketAndLogin(isUpgrade));

    return dispatch(onSuccessfulLogin());
  };
}

function getTicketAndLogin(isUpgrade) {
  return async(dispatch, getState) => {
    const upgradeToken = getState().auth.upgradeToken;
    const keyTicketResult = await dispatch(callApi(REQUESTS.KEY_GET_TICKET, {}, {}));
    const data = { code: keyTicketResult.ticket };
    if (isUpgrade) {
      data.client_token = upgradeToken;
    }

    await dispatch(callApi(REQUESTS.TICKET_LOGIN, {}, data));
  };
}

export function codeLogin(code) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.CREATE_MY_PERSON, {}, { code }))
      .then(() => {
        // Make sure this is set to FIRST_TIME so we know we're in the tryItNow flow
        dispatch(firstTime());
        return dispatch(onSuccessfulLogin());
      });
  };
}

export function refreshAnonymousLogin() {
  return (dispatch, getState) => {
    const code = getState().auth.upgradeToken;

    return dispatch(callApi(REQUESTS.REFRESH_ANONYMOUS_LOGIN, {}, { code }));
  };
}

export function logout() {
  return (dispatch, getState) => {
    dispatch(logOutAnalytics());

    const pushDeviceId = getState().notifications.pushDeviceId;
    if (!pushDeviceId) {
      dispatch(logoutReset());
    } else {
      dispatch(deletePushToken(pushDeviceId)).then(() => {
        dispatch(logoutReset());
      }).catch(() => {
        dispatch(logoutReset());
      });
    }
  };
}

export function logoutReset() {
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

export function getTimezoneString() {
  return `${new Date().getTimezoneOffset() / 60 * -1}`;
}

export function updateLocaleAndTimezone() {
  return (dispatch, getState) => {
    const { person: { user } } = getState().auth;
    const timezone = getTimezoneString();
    const language = i18next.language;
    if (user.timezone !== timezone || user.mobile_language !== language) {
      const data = {
        data: {
          attributes: {
            timezone,
            mobile_language: language,
          },
        },
      };
      return dispatch(callApi(REQUESTS.UPDATE_ME_USER, {}, data));
    }
  };
}

export function loadHome() {
  return (dispatch) => {
    // TODO: Set this up so it only loads these if it hasn't loaded them in X amount of time
    dispatch(getMe());
    dispatch(getAssignedOrganizations());
    dispatch(getStagesIfNotExists());
    dispatch(updateLocaleAndTimezone());
    dispatch(reregisterNotificationHandler());
  };
}
