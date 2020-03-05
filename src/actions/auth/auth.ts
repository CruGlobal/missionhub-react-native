// @ts-ignore
import PushNotification from 'react-native-push-notification';
// @ts-ignore
import { AccessToken } from 'react-native-fbsdk';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import {
  CLEAR_UPGRADE_TOKEN,
  LOGOUT,
  NOTIFICATION_PROMPT_TYPES,
} from '../../constants';
import { LANDING_SCREEN } from '../../containers/LandingScreen';
import { rollbar } from '../../utils/rollbar.config';
import { navigateReset } from '../navigation';
import { deletePushToken, checkNotifications } from '../notifications';
import {
  SIGN_IN_FLOW,
  ADD_SOMEONE_ONBOARDING_FLOW,
  GET_STARTED_ONBOARDING_FLOW,
} from '../../routes/constants';
import { navigateToMainTabs } from '../navigation';
import { apolloClient } from '../../apolloClient';
import { startOnboarding } from '../onboarding';
import { AuthState } from '../../reducers/auth';
import { Person } from '../../reducers/people';
import { NotificationsState } from '../../reducers/notifications';

import { refreshAccessToken } from './key';
import { refreshAnonymousLogin } from './anonymous';
import { refreshMissionHubFacebookAccess } from './facebook';

export function logout(forcedLogout = false) {
  return async (
    dispatch: ThunkDispatch<
      { notifications: NotificationsState },
      {},
      AnyAction
    >,
  ) => {
    try {
      await dispatch(deletePushToken());
    } finally {
      dispatch({ type: LOGOUT });
      apolloClient.clearStore();
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
  firstAction: AnyAction,
  secondAction: AnyAction,
) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
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

export const navigateToPostAuthScreen = () => (
  dispatch: ThunkDispatch<
    { auth: AuthState; notifications: NotificationsState },
    {},
    AnyAction
  >,
  getState: () => { auth: AuthState },
) => {
  const { person } = getState().auth;

  if (!person.user.pathway_stage_id) {
    dispatch(startOnboarding());
    dispatch(navigateReset(GET_STARTED_ONBOARDING_FLOW));
  } else if (hasPersonWithStageSelected(person)) {
    dispatch(navigateToMainTabs());
    dispatch(checkNotifications(NOTIFICATION_PROMPT_TYPES.LOGIN));
  } else {
    dispatch(startOnboarding());
    dispatch(navigateReset(ADD_SOMEONE_ONBOARDING_FLOW));
  }
};

function hasPersonWithStageSelected(person: Person) {
  return person.contact_assignments.some(
    (contact: { pathway_stage_id: string }) => contact.pathway_stage_id,
  );
}

export const handleInvalidAccessToken = () => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    getState: () => { auth: AuthState },
  ) => {
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
