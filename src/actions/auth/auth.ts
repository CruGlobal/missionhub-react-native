import PushNotification from 'react-native-push-notification';
import { LoginManager } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { LOGOUT } from '../../constants';
import { LANDING_SCREEN } from '../../containers/LandingScreen';
import { rollbar } from '../../utils/rollbar.config';
import { navigateReset } from '../navigation';
import { deletePushToken } from '../notifications';
import { SIGN_IN_FLOW } from '../../routes/constants';
import { apolloClient } from '../../apolloClient';
import { RootState } from '../../reducers';
import { deleteAllAuthTokens } from '../../auth/authStore';

export function logout(forcedLogout = false) {
  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    try {
      await dispatch(deletePushToken());
    } finally {
      dispatch(
        forcedLogout
          ? navigateReset(SIGN_IN_FLOW, { forcedLogout })
          : navigateReset(LANDING_SCREEN),
      );
      dispatch({ type: LOGOUT });
      apolloClient.clearStore();
      PushNotification.unregister();
      rollbar.clearPerson();
      try {
        LoginManager.logOut();
      } catch {}
      try {
        GoogleSignin.signOut();
      } catch {}
      await deleteAllAuthTokens();
    }
  };
}
