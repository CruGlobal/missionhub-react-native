import {
  ACTIONS,
  CLEAR_UPGRADE_TOKEN,
  LOGOUT,
  MAIN_TABS,
} from '../../constants';
import { LANDING_SCREEN } from '../../containers/LandingScreen';
import { rollbar } from '../../utils/rollbar.config';
import { navigateReset } from '../navigation';
import { deletePushToken } from '../notifications';
import { trackActionWithoutData } from '../analytics';
import { SIGN_IN_FLOW } from '../../routes/constants';
import { GET_STARTED_SCREEN } from '../../containers/GetStartedScreen';
import { completeOnboarding } from '../onboardingProfile';
import { ADD_SOMEONE_SCREEN } from '../../containers/AddSomeoneScreen';

export function logout(forcedLogout = false) {
  return async dispatch => {
    await dispatch(deletePushToken());
    dispatch({ type: LOGOUT });
    dispatch(
      forcedLogout
        ? navigateReset(SIGN_IN_FLOW, { forcedLogout })
        : navigateReset(LANDING_SCREEN),
    );
    rollbar.clearPerson();
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

  let nextScreen;

  if (!person.user.pathway_stage_id) {
    nextScreen = GET_STARTED_SCREEN;
    dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_STARTED));
  } else if (hasPersonWithStageSelected(person)) {
    nextScreen = MAIN_TABS;
    dispatch(completeOnboarding());
  } else {
    nextScreen = ADD_SOMEONE_SCREEN;
    dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_STARTED));
  }

  dispatch(navigateReset(nextScreen));
};

function hasPersonWithStageSelected(person) {
  return person.contact_assignments.some(contact => contact.pathway_stage_id);
}
