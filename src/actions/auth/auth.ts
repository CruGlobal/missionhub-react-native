import PushNotification from 'react-native-push-notification';
import { AccessToken } from 'react-native-fbsdk';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { CLEAR_UPGRADE_TOKEN, LOGOUT } from '../../constants';
import { LANDING_SCREEN } from '../../containers/LandingScreen';
import { rollbar } from '../../utils/rollbar.config';
import { navigateReset } from '../navigation';
import { deletePushToken } from '../notifications';
import { SIGN_IN_FLOW } from '../../routes/constants';
import { apolloClient } from '../../apolloClient';
import { RootState } from '../../reducers';

import { refreshAccessToken } from './key';
import { refreshAnonymousLogin } from './anonymous';
import { refreshMissionHubFacebookAccess } from './facebook';

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
    }
  };
}

export const retryIfInvalidatedClientToken = (
  // @ts-ignore
  firstAction,
  // @ts-ignore
  secondAction,
) => async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
  // Historically we haven't cleared the client_token from redux after use,
  // so if the API throws a client_token invalidated error we retry this request
  // again without the client_token
  try {
    await dispatch(firstAction);
    dispatch({ type: CLEAR_UPGRADE_TOKEN });
  } catch (error) {
    // @ts-ignore
    const { apiError: { errors: [{ status, detail } = {}] = [] } = {} } = error;

    if (status === '422' && detail === 'client_token already invalidated') {
      await dispatch(secondAction);
      dispatch({ type: CLEAR_UPGRADE_TOKEN });
    } else {
      throw error;
    }
  }
};

export const handleInvalidAccessToken = () => {
  return async (
    dispatch: ThunkDispatch<RootState, never, AnyAction>,
    getState: () => RootState,
    // Return true if the request should be retried after refreshing token
  ): Promise<boolean> => {
    const { auth } = getState();

    if (!auth.token) {
      return false;
    }

    if (auth.refreshToken) {
      await dispatch(refreshAccessToken());
      return true;
    }

    if (auth.upgradeToken) {
      await dispatch(refreshAnonymousLogin());
      return true;
    }

    const { accessToken } = (await AccessToken.getCurrentAccessToken()) || {};
    if (accessToken) {
      await dispatch(refreshMissionHubFacebookAccess());
      return true;
    }

    dispatch(logout(true));
    return false;
  };
};
