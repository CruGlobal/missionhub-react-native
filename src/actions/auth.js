import Buffer from 'buffer';

import base64url from 'base64-url';
import { sha256 } from 'js-sha256';
import { Linking } from 'react-native';
import randomString from 'random-string';
import i18next from 'i18next';

import { THE_KEY_CLIENT_ID, LOGOUT, FIRST_TIME, OPEN_URL } from '../constants';
import { LANDING_SCREEN } from '../containers/LandingScreen';
import { UPGRADE_ACCOUNT_SCREEN } from '../containers/UpgradeAccountScreen';
import { THE_KEY_URL } from '../api/utils';
import { KEY_LOGIN_SCREEN } from '../containers/KeyLoginScreen';

import { navigateReset, navigatePush } from './navigation';
import { getMe } from './person';
import { deletePushToken, showReminderOnLoad } from './notifications';
import { getStagesIfNotExists } from './stages';
import { getMySteps } from './steps';
import callApi, { REQUESTS } from './api';
import { onSuccessfulLogin } from './login';
import {
  getMyOrganizations,
  getOrganizationsContactReports,
} from './organizations';
import { resetPerson } from './onboardingProfile';

export function openKeyURL(
  baseURL,
  onReturn,
  upgradeAccount = false,
  onComplete,
) {
  return dispatch => {
    global.Buffer = global.Buffer || Buffer.Buffer;

    const string = randomString({
      length: 50,
      numeric: true,
      letters: true,
      special: false,
    });
    const codeVerifier = base64url.encode(string);
    const codeChallenge = base64url.encode(sha256.array(codeVerifier));
    const redirectUri = 'https://missionhub.com/auth';

    const uri =
      `${THE_KEY_URL}${baseURL}&client_id=${THE_KEY_CLIENT_ID}&response_type=code` +
      `&redirect_uri=${redirectUri}&scope=fullticket%20extended&code_challenge_method=S256` +
      `&code_challenge=${codeChallenge}`;

    function onLinkBack(event) {
      Linking.removeEventListener('url', onLinkBack);
      const code = event.url.split('code=')[1];
      onReturn();

      return dispatch(
        createAccountAndLogin(
          code,
          codeVerifier,
          redirectUri,
          upgradeAccount ? upgradeAccount : null,
          onComplete,
        ),
      );
    }

    Linking.addEventListener('url', onLinkBack);

    Linking.openURL(uri);
    return dispatch({ type: OPEN_URL });
  };
}

export function createAccountAndLogin(
  code,
  verifier,
  redirectUri,
  isUpgrade,
  onComplete,
) {
  const data = `grant_type=authorization_code&client_id=${THE_KEY_CLIENT_ID}&code=${code}&code_verifier=${verifier}&redirect_uri=${redirectUri}`;

  return getTokenAndLogin(data, isUpgrade, onComplete);
}

export function refreshAccessToken() {
  return async (dispatch, getState) => {
    const data = `grant_type=refresh_token&refresh_token=${
      getState().auth.refreshToken
    }`;

    await dispatch(callApi(REQUESTS.KEY_REFRESH_TOKEN, {}, data));
    dispatch(getTicketAndLogin());
  };
}

export function keyLogin(
  email,
  password,
  mfaCode,
  isUpgrade = false,
  onComplete,
) {
  let data =
    `grant_type=password&client_id=${THE_KEY_CLIENT_ID}&scope=fullticket%20extended` +
    `&username=${encodeURIComponent(email)}&password=${encodeURIComponent(
      password,
    )}`;

  if (mfaCode) {
    data = `${data}&thekey_mfa_token=${mfaCode}`;
  }

  return getTokenAndLogin(data, isUpgrade, onComplete);
}

function getTokenAndLogin(data, isUpgrade, onComplete) {
  return async dispatch => {
    await dispatch(callApi(REQUESTS.KEY_LOGIN, {}, data));
    await dispatch(getTicketAndLogin(isUpgrade));

    return dispatch(onSuccessfulLogin(onComplete));
  };
}

function getTicketAndLogin(isUpgrade) {
  return async (dispatch, getState) => {
    const upgradeToken = getState().auth.upgradeToken;
    const keyTicketResult = await dispatch(
      callApi(REQUESTS.KEY_GET_TICKET, {}, {}),
    );
    const data = { code: keyTicketResult.ticket };
    if (isUpgrade) {
      data.client_token = upgradeToken;
    }

    await dispatch(callApi(REQUESTS.TICKET_LOGIN, {}, data));
  };
}

export function codeLogin(code) {
  return dispatch => {
    return dispatch(callApi(REQUESTS.CREATE_MY_PERSON, {}, { code })).then(
      () => {
        // Make sure this is set to FIRST_TIME so we know we're in the tryItNow flow
        dispatch(firstTime());
        return dispatch(onSuccessfulLogin());
      },
    );
  };
}

export function refreshAnonymousLogin() {
  return (dispatch, getState) => {
    const code = getState().auth.upgradeToken;

    return dispatch(callApi(REQUESTS.REFRESH_ANONYMOUS_LOGIN, {}, { code }));
  };
}

export function logout(forcedLogout = false) {
  return dispatch => {
    dispatch(deletePushToken());
    dispatch({ type: LOGOUT });
    dispatch(
      forcedLogout
        ? navigateReset(KEY_LOGIN_SCREEN, { forcedLogout })
        : navigateReset(LANDING_SCREEN),
    );
  };
}

export function upgradeAccount(signupType, onComplete) {
  return dispatch => {
    dispatch(
      navigatePush(UPGRADE_ACCOUNT_SCREEN, {
        signupType,
        onComplete,
      }),
    );
  };
}

export function upgradeAccountSignIn() {
  return dispatch => {
    dispatch(navigatePush(KEY_LOGIN_SCREEN, { upgradeAccount: true }));
  };
}

export function firstTime() {
  return dispatch => {
    dispatch({ type: FIRST_TIME });
  };
}

export function getTimezoneString() {
  return `${(new Date().getTimezoneOffset() / 60) * -1}`;
}

export function updateLocaleAndTimezone() {
  return (dispatch, getState) => {
    const {
      person: { user },
    } = getState().auth;
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
  return async (dispatch, getState) => {
    // Don't try to run all these things if there is no token
    if (!getState().auth.token) {
      return Promise.resolve();
    }
    // TODO: Set this up so it only loads these if it hasn't loaded them in X amount of time
    dispatch(getMe());
    dispatch(getMyOrganizations());
    dispatch(getOrganizationsContactReports());
    dispatch(getStagesIfNotExists());
    dispatch(updateLocaleAndTimezone());
    dispatch(resetPerson());
    await dispatch(getMySteps());
    dispatch(showReminderOnLoad());
  };
}
