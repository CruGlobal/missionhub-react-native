import { LoginManager, AccessToken } from 'react-native-fbsdk';

import { ANALYTICS } from '../../constants';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { updateAnalyticsContext } from '../analytics';

import { retryIfInvalidatedClientToken } from './auth';
import { authSuccess } from './userData';

const FACEBOOK_SCOPE = ['public_profile', 'email'];

export function facebookPromptLogin() {
  return async () => {
    const result = await LoginManager.logInWithReadPermissions(FACEBOOK_SCOPE);
    if (result.isCancelled) {
      throw Error('Facebook login canceled by user');
    }
  };
}

export function facebookLoginWithAccessToken() {
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

function facebookLoginAction(accessToken, facebookId) {
  return async (dispatch, getState) => {
    const { upgradeToken } = getState().auth;

    await dispatch(
      retryIfInvalidatedClientToken(
        loginWithFacebookAccessToken(accessToken, upgradeToken),
        loginWithFacebookAccessToken(accessToken),
      ),
    );
    dispatch(updateAnalyticsContext({ [ANALYTICS.FACEBOOK_ID]: facebookId }));
  };
}

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
  return async dispatch => {
    try {
      await AccessToken.refreshCurrentAccessTokenAsync();
    } catch (error) {
      await dispatch(facebookPromptLogin());
    } finally {
      await dispatch(facebookLoginWithAccessToken());
    }
  };
}
