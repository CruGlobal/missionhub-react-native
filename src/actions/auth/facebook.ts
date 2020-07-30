// @ts-ignore
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import {
  FACEBOOK_CANCELED_ERROR,
  ANALYTICS_FACEBOOK_ID,
} from '../../constants';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { updateAnalyticsContext } from '../analytics';
import { RootState } from '../../reducers';

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
  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
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

function facebookLoginAction(accessToken: string, facebookId?: string) {
  return async (
    dispatch: ThunkDispatch<RootState, never, AnyAction>,
    getState: () => RootState,
  ) => {
    const { upgradeToken } = getState().auth;

    await dispatch(
      retryIfInvalidatedClientToken(
        loginWithFacebookAccessToken(accessToken, upgradeToken),
        loginWithFacebookAccessToken(accessToken),
      ),
    );
    dispatch(updateAnalyticsContext({ [ANALYTICS_FACEBOOK_ID]: facebookId }));
  };
}

const loginWithFacebookAccessToken = (
  fb_access_token: string,
  client_token?: string | null,
) =>
  callApi(
    REQUESTS.FACEBOOK_LOGIN,
    {},
    {
      fb_access_token,
      ...(client_token && { client_token }),
    },
  );

export function refreshMissionHubFacebookAccess() {
  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
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
