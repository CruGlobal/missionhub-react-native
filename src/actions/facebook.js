import { LoginManager, AccessToken } from 'react-native-fbsdk';

import { ANALYTICS } from '../constants';

import callApi, { REQUESTS } from './api';
import { updateAnalyticsContext } from './analytics';

const FACEBOOK_SCOPE = ['public_profile', 'email'];

export function facebookLoginWithUsernamePassword(
  isUpgrade,
  startLoad,
  onComplete,
) {
  return async dispatch => {
    try {
      const result = await LoginManager.logInWithReadPermissions(
        FACEBOOK_SCOPE,
      );
      LOG('Facebook login result', result);
      if (result.isCancelled) {
        return;
      }
      startLoad && startLoad();
      return dispatch(facebookLoginWithAccessToken(isUpgrade, onComplete));
    } catch (err) {
      LOG('err', err);
      LoginManager.logOut();
    }
  };
}

export function facebookLoginWithAccessToken(isUpgrade, onComplete) {
  return async dispatch => {
    const data = await AccessToken.getCurrentAccessToken();
    const { accessToken, userID } = data;

    if (!accessToken) {
      LOG('facebook access token doesnt exist');
      return;
    }

    await dispatch(
      facebookLoginAction(accessToken.toString(), userID, isUpgrade),
    );
    onComplete && dispatch(onComplete());
  };
}

export function facebookLoginAction(accessToken, id, isUpgrade = false) {
  return async (dispatch, getState) => {
    const upgradeToken = getState().auth.upgradeToken;
    const data = { fb_access_token: accessToken };
    if (isUpgrade) {
      data.client_token = upgradeToken;
    }

    const results = await dispatch(callApi(REQUESTS.FACEBOOK_LOGIN, {}, data));
    LOG(results);
    dispatch(updateAnalyticsContext({ [ANALYTICS.FACEBOOK_ID]: id }));
  };
}

export function refreshMissionHubFacebookAccess() {
  return async dispatch => {
    try {
      await AccessToken.refreshCurrentAccessTokenAsync();
      const { accessToken, userID } = await AccessToken.getCurrentAccessToken();
      return await dispatch(facebookLoginAction(accessToken, userID));
    } catch (error) {
      dispatch(facebookLoginWithUsernamePassword(false, null));
    }
  };
}
