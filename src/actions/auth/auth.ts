import PushNotification from 'react-native-push-notification';
// @ts-ignore
import { AccessToken } from 'react-native-fbsdk';

import { CLEAR_UPGRADE_TOKEN, LOGOUT } from '../../constants';
import { LANDING_SCREEN } from '../../containers/LandingScreen';
import { rollbar } from '../../utils/rollbar.config';
import { navigateReset } from '../navigation';
import { deletePushToken } from '../notifications';
import { SIGN_IN_FLOW } from '../../routes/constants';
import { getFeatureFlags } from '../misc';
import { apolloClient } from '../../apolloClient';

import { refreshAccessToken } from './key';
import { refreshAnonymousLogin } from './anonymous';
import { refreshMissionHubFacebookAccess } from './facebook';

export function logout(forcedLogout = false) {
  // @ts-ignore
  return async dispatch => {
    try {
      await dispatch(deletePushToken());
    } finally {
      dispatch({ type: LOGOUT });
      apolloClient.clearStore();
      getFeatureFlags();
      dispatch(
        forcedLogout
          ? navigateReset(SIGN_IN_FLOW, { forcedLogout })
          : navigateReset(LANDING_SCREEN),
      );
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
  // @ts-ignore
) => async dispatch => {
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
  // @ts-ignore
  return async (dispatch, getState) => {
    const { auth } = getState();

    if (auth.refreshToken) {
      return dispatch(refreshAccessToken());
    }

    if (auth.upgradeToken) {
      return dispatch(refreshAnonymousLogin());
    }

    const { accessToken } = (await AccessToken.getCurrentAccessToken()) || {};
    if (accessToken) {
      return dispatch(refreshMissionHubFacebookAccess());
    }

    dispatch(logout(true));
  };
};
