import { ANALYTICS } from '../constants';
import callApi, { REQUESTS } from './api';
import { updateAnalyticsContext } from './analytics';
import { LoginManager, AccessToken } from 'react-native-fbsdk';

const FACEBOOK_SCOPE = [ 'public_profile', 'email' ];

export function facebookLoginWithUsernamePassword(isUpgrade, onComplete) {
  return (dispatch) => {
    return LoginManager.logInWithReadPermissions(FACEBOOK_SCOPE).then((result) => {
      LOG('Facebook login result', result);
      if (result.isCancelled) {
        return;
      }
      return dispatch(facebookLoginWithAccessToken(isUpgrade, onComplete));

    }, (err) => {
      LOG('err', err);
      LoginManager.logOut();
      return;
    });
  };
}

export function facebookLoginWithAccessToken(isUpgrade, onComplete) {
  return (dispatch) => {
    return AccessToken.getCurrentAccessToken().then((data) => {
      const { accessToken, userID } = data;

      if (!accessToken) {
        LOG('facebook access token doesnt exist');
        return;
      }

      return dispatch(facebookLoginAction(accessToken.toString(), userID, isUpgrade)).then(() => {
        onComplete && dispatch(onComplete());
      });
    });
  };
}

export function facebookLoginAction(accessToken, id, isUpgrade = false) {
  return (dispatch, getState) => {
    const upgradeToken = getState().auth.upgradeToken;
    const data = { fb_access_token: accessToken };
    if (isUpgrade) {
      data.provider = 'client_token';
      data.client_token = upgradeToken;
    }

    return dispatch(callApi(REQUESTS.FACEBOOK_LOGIN, {}, data)).then((results) => {
      LOG(results);
      dispatch(updateAnalyticsContext({ [ANALYTICS.FACEBOOK_ID]: id }));
    });
  };
}

export function refreshMissionHubFacebookAccess() {
  return async(dispatch) => {
    try {
      await AccessToken.refreshCurrentAccessTokenAsync();
      const { accessToken, userID } = await AccessToken.getCurrentAccessToken();
      return await dispatch(facebookLoginAction(accessToken, userID));

    } catch (error) {
      dispatch(facebookLoginWithUsernamePassword(false, null));
    }
  };
}
