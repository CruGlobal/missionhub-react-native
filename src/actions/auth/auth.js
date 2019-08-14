import PushNotification from 'react-native-push-notification';

import { ACTIONS, CLEAR_UPGRADE_TOKEN, LOGOUT } from '../../constants';
import { LANDING_SCREEN } from '../../containers/LandingScreen';
import { rollbar } from '../../utils/rollbar.config';
import { navigateReset } from '../navigation';
import { deletePushToken } from '../notifications';
import { trackActionWithoutData } from '../analytics';
import {
  SIGN_IN_FLOW,
  ADD_SOMEONE_ONBOARDING_FLOW,
  GET_STARTED_ONBOARDING_FLOW,
} from '../../routes/constants';
import { completeOnboarding } from '../onboardingProfile';
import { navigateToMainTabs } from '../navigation';
import { apolloClient } from '../../apolloClient';

export function logout(forcedLogout = false) {
  return async dispatch => {
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
  firstAction,
  secondAction,
) => async dispatch => {
  // Historically we haven't cleared the client_token from redux after use,
  // so if the API throws a client_token invalidated error we retry this request
  // again without the client_token
  try {
    await dispatch(firstAction);
    dispatch({ type: CLEAR_UPGRADE_TOKEN });
  } catch (error) {
    const { apiError: { errors: [{ status, detail } = {}] = [] } = {} } = error;

    if (status === '422' && detail === 'client_token already invalidated') {
      await dispatch(secondAction);
      dispatch({ type: CLEAR_UPGRADE_TOKEN });
    } else {
      throw error;
    }
  }
};

export const navigateToPostAuthScreen = () => (dispatch, getState) => {
  const { person } = getState().auth;

  if (!person.user.pathway_stage_id) {
    dispatch(
      navigateReset(GET_STARTED_ONBOARDING_FLOW, { enableBackButton: false }),
    );
    dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_STARTED));
  } else if (hasPersonWithStageSelected(person)) {
    dispatch(navigateToMainTabs());
    dispatch(completeOnboarding());
  } else {
    dispatch(navigateReset(ADD_SOMEONE_ONBOARDING_FLOW));
    dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_STARTED));
  }
};

function hasPersonWithStageSelected(person) {
  return person.contact_assignments.some(contact => contact.pathway_stage_id);
}
