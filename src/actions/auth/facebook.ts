import { LoginManager, AccessToken } from 'react-native-fbsdk';

import { ANALYTICS, FACEBOOK_CANCELED_ERROR } from '../../constants';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { updateAnalyticsContext } from '../analytics';

import { retryIfInvalidatedClientToken } from './auth';
import { authSuccess } from './userData';

const FACEBOOK_SCOPE = ['public_profile', 'email'];

export function facebookPromptLogin() {
  return async () => {
    const result = await LoginManager.logInWithPermissions(FACEBOOK_SCOPE);
    if (result.isCancelled) {
      throw Error(FACEBOOK_CANCELED_ERROR);
    }
  };
}

export function facebookLoginWithAccessToken() {
  // @ts-ignore
  return async dispatch => {
    try {
      const { accessToken, userID } =
        (await AccessToken.getCurrentAccessToken()) || {};

      if (!accessToken) {
        throw Error("Facebook access token doesn't exist");
      }

      await dispatch(facebookLoginAction(accessToken.toString(), userID));
      await dispatch(authSuccess());
    } catch (error) {
      LoginManager.logOut();
      throw error;
    }
  };
}

// @ts-ignore
function facebookLoginAction(accessToken, facebookId) {
  // @ts-ignore
  return async (dispatch, getState) => {
    const { upgradeToken } = getState().auth;

    await dispatch(
      retryIfInvalidatedClientToken(
        // @ts-ignore
        loginWithFacebookAccessToken(accessToken, upgradeToken),
        // @ts-ignore
        loginWithFacebookAccessToken(accessToken),
      ),
    );
    dispatch(updateAnalyticsContext({ [ANALYTICS.FACEBOOK_ID]: facebookId }));
  };
}

// @ts-ignore
const loginWithFacebookAccessToken = (fb_access_token, client_token) =>
  callApi(
    REQUESTS.FACEBOOK_LOGIN,
    {},
    {
      fb_access_token,
      ...(client_token && { client_token }),
    },
  );

export function refreshMissionHubFacebookAccess() {
  // @ts-ignore
  return async dispatch => {
    try {
      try {
        await AccessToken.refreshCurrentAccessTokenAsync();
      } catch (error) {
        await dispatch(facebookPromptLogin());
      }
      await dispatch(facebookLoginWithAccessToken());
    } catch (error) {
      if (error.message === FACEBOOK_CANCELED_ERROR) {
        LoginManager.logOut();
      } else {
        throw error;
      }
    }
  };
}
