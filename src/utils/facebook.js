import { facebookLoginAction } from '../actions/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk';

const FACEBOOK_SCOPE = [ 'public_profile', 'email' ];

export function facebookLoginWithUsernamePassword(dispatch, isUpgrade) {
  LoginManager.logInWithReadPermissions(FACEBOOK_SCOPE).then((result) => {
    LOG('Facebook login result', result);
    if (result.isCancelled) {
      return;
    }
    facebookLoginWithAccessToken(dispatch, isUpgrade);
  }, (err) => {
    LOG('err', err);
    LoginManager.logOut();
  }).catch(() => {
    LOG('facebook login manager catch');
  });
}

export function refreshFacebookAccess() {

}

export function facebookLoginWithAccessToken(dispatch, isUpgrade) {
  AccessToken.getCurrentAccessToken().then((data) => {
    const { accessToken, userID } = data;

    if (!accessToken) {
      LOG('facebook access token doesnt exist');
      return;
    }

    dispatch(facebookLoginAction(accessToken.toString(), userID, isUpgrade));
  });
}
