import { navigatePush, navigateBack } from './navigation';
import { SETUP_SCREEN } from '../containers/SetupScreen';
import { WELCOME_SCREEN } from '../containers/WelcomeScreen';
import { LOGIN_SCREEN } from '../containers/LoginScreen';
import { LOGIN_OPTIONS_SCREEN } from '../containers/LoginOptionsScreen';
import {
  SCREEN_FLOW_START,
  SCREEN_FLOW_NEXT,
  SCREEN_FLOW_PREVIOUS,
} from '../constants';
import { KEY_LOGIN_SCREEN } from '../containers/KeyLoginScreen';
import {
  AuthenticateFlow,
  authenticateFlowNext,
} from './screenFlows/authenticateFlow';
import {
  currentFlow,
  currentFlowName,
  currentScreenOfCurrentFlow,
} from '../selectors/screenFlow';

// export const ScreenFlows = Object.freeze({
//   Authenticate: 'AUTHENTICATE_FLOW',
//   CreateAccount: 'CREATE_ACCOUNT_FLOW',
//   SignIn: 'SIGN_IN_FLOW',
//   Onboarding: 'ONBOARDING_FLOW',
// });

export function screenFlowStart(newFlow) {
  return dispatch => {
    const { flow, screen } = getNextFlowState(newFlow);

    dispatch({ type: SCREEN_FLOW_START, flow, screen });
    dispatch(navigatePush(screen.screen));
  };
}

export function screenFlowNext(payload = {}) {
  return (dispatch, getState) => {
    const { screenFlow } = getState();
    const { screen } = getNextFlowState(
      currentFlowName(screenFlow),
      currentScreenOfCurrentFlow(screenFlow),
      payload,
    );

    dispatch({ type: SCREEN_FLOW_NEXT, flowState });
    dispatch(navigatePush(screen));
  };
}

export function screenFlowPrevious() {
  return (dispatch, getState) => {
    const { screenFlow } = getState();

    // TODO: change state from storing screen name to storing object { name, backAction, skipHistory }

    // TODO: can this call another back function to implement skipHistory?
    // TODO: can this return something to cancel back action or skipHistory?
    // Action to perform when leaving this screen (undo changes, logout, update redux, prompt before going back, etc). No effect if skipHistory is also enabled.
    currentFlow(screenFlow).backAction();

    // Go back twice if we're skipping current screen // TODO: this isn't going to work. Could have to skip several screens in a row
    if (currentFlow(screenFlow).skipHistory) {
      // TODO: fix. this isn't going to work. Need to store a placeholder so we don't go back too far if we only rely on history and not a previous state function/switch
      dispatch({ type: SCREEN_FLOW_PREVIOUS });
    }
    dispatch({ type: SCREEN_FLOW_PREVIOUS });
    dispatch(navigateBack()); // TODO: figure out times to go back
  };
}

function getNextFlowState(currentFlow, currentScreen, payload) {
  switch (currentFlow) {
    case AuthenticateFlow:
      return authenticateFlowNext(currentScreen, payload);
    default:
      return null;
  }
}

// WELCOME_SCREEN
// SETUP_SCREEN
