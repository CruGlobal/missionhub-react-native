import Buffer from 'buffer';

import base64url from 'base64-url';
import { sha256 } from 'js-sha256';
import { Linking } from 'react-native';
import randomString from 'random-string';
import Config from 'react-native-config';

import { THE_KEY_CLIENT_ID } from '../../constants';
import callApi, { REQUESTS } from '../api';

import { retryIfInvalidatedClientToken } from './auth';
import { authSuccess } from './userData';

export function openKeyURL(baseURL) {
  return () => {
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
      `${
        Config.THE_KEY_URL
      }${baseURL}&client_id=${THE_KEY_CLIENT_ID}&response_type=code` +
      `&redirect_uri=${redirectUri}&scope=fullticket%20extended&code_challenge_method=S256` +
      `&code_challenge=${codeChallenge}`;

    return new Promise(resolve => {
      function onLinkBack(event) {
        Linking.removeEventListener('url', onLinkBack);
        const code = event.url.split('code=')[1];
        resolve({ code, codeVerifier, redirectUri });
      }

      Linking.addEventListener('url', onLinkBack);

      Linking.openURL(uri);
    });
  };
}

export function keyLogin(email, password, mfaCode) {
  const data =
    `grant_type=password&client_id=${THE_KEY_CLIENT_ID}&scope=fullticket%20extended` +
    `&username=${encodeURIComponent(email)}&password=${encodeURIComponent(
      password,
    )}${mfaCode ? `&thekey_mfa_token=${mfaCode}` : ''}`;

  return getTokenAndLogin(data);
}

export function keyLoginWithAuthorizationCode(code, codeVerifier, redirectUri) {
  const data = `grant_type=authorization_code&client_id=${THE_KEY_CLIENT_ID}&code=${code}&code_verifier=${codeVerifier}&redirect_uri=${redirectUri}`;

  return getTokenAndLogin(data);
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

function getTokenAndLogin(data) {
  return async dispatch => {
    await dispatch(callApi(REQUESTS.KEY_LOGIN, {}, data));
    await dispatch(getTicketAndLogin());

    return dispatch(authSuccess());
  };
}

function getTicketAndLogin() {
  return async (dispatch, getState) => {
    const { upgradeToken } = getState().auth;
    const { ticket } = await dispatch(callApi(REQUESTS.KEY_GET_TICKET, {}, {}));

    await dispatch(
      retryIfInvalidatedClientToken(
        loginWithKeyTicket(ticket, upgradeToken),
        loginWithKeyTicket(ticket),
      ),
    );
  };
}

const loginWithKeyTicket = (ticket, client_token) =>
  callApi(
    REQUESTS.TICKET_LOGIN,
    {},
    {
      code: ticket,
      ...(client_token ? { client_token } : {}),
    },
  );
