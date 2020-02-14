import Buffer from 'buffer';

// @ts-ignore
import base64url from 'base64-url';
import { sha256 } from 'js-sha256';
import { Linking } from 'react-native';
// @ts-ignore
import randomString from 'random-string';
import Config from 'react-native-config';

import { THE_KEY_CLIENT_ID } from '../../constants';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';

import { retryIfInvalidatedClientToken } from './auth';
import { authSuccess } from './userData';

// @ts-ignore
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
      `${Config.THE_KEY_URL}${baseURL}&client_id=${THE_KEY_CLIENT_ID}&response_type=code` +
      `&redirect_uri=${redirectUri}&scope=fullticket%20extended&code_challenge_method=S256` +
      `&code_challenge=${codeChallenge}`;

    return new Promise(resolve => {
      // @ts-ignore
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

// @ts-ignore
export function keyLogin(email, password, mfaCode) {
  const data =
    `grant_type=password&client_id=${THE_KEY_CLIENT_ID}&scope=fullticket%20extended` +
    `&username=${encodeURIComponent(email)}&password=${encodeURIComponent(
      password,
    )}${mfaCode ? `&thekey_mfa_token=${mfaCode}` : ''}`;

  return getTokenAndLogin(data);
}

// @ts-ignore
export function keyLoginWithAuthorizationCode(code, codeVerifier, redirectUri) {
  const data = `grant_type=authorization_code&client_id=${THE_KEY_CLIENT_ID}&code=${code}&code_verifier=${codeVerifier}&redirect_uri=${redirectUri}`;

  return getTokenAndLogin(data);
}

export function refreshAccessToken() {
  // @ts-ignore
  return async (dispatch, getState) => {
    const data = `grant_type=refresh_token&refresh_token=${
      getState().auth.refreshToken
    }`;

    // @ts-ignore
    await dispatch(callApi(REQUESTS.KEY_REFRESH_TOKEN, {}, data));
    dispatch(getTicketAndLogin());
  };
}

// @ts-ignore
function getTokenAndLogin(data) {
  // @ts-ignore
  return async dispatch => {
    await dispatch(callApi(REQUESTS.KEY_LOGIN, {}, data));
    await dispatch(getTicketAndLogin());

    return dispatch(authSuccess());
  };
}

function getTicketAndLogin() {
  // @ts-ignore
  return async (dispatch, getState) => {
    const { upgradeToken } = getState().auth;
    const { ticket } = await dispatch(callApi(REQUESTS.KEY_GET_TICKET, {}, {}));

    await dispatch(
      retryIfInvalidatedClientToken(
        // @ts-ignore
        loginWithKeyTicket(ticket, upgradeToken),
        // @ts-ignore
        loginWithKeyTicket(ticket),
      ),
    );
  };
}

// @ts-ignore
const loginWithKeyTicket = (ticket, client_token) =>
  callApi(
    REQUESTS.TICKET_LOGIN,
    {},
    {
      code: ticket,
      ...(client_token ? { client_token } : {}),
    },
  );
