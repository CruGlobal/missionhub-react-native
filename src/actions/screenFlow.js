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

// export const ScreenFlows = Object.freeze({
//   Authenticate: 'AUTHENTICATE_FLOW',
//   CreateAccount: 'CREATE_ACCOUNT_FLOW',
//   SignIn: 'SIGN_IN_FLOW',
//   Onboarding: 'ONBOARDING_FLOW',
// });

export function screenFlowStart(flow) {
  return dispatch => {
    const flowState = {
      ...getNextFlowState({ flow }),
      start: true, // TODO: remove if I don't use the start idea: [screenFlow.history.filter(item => item.start).slice(-2)[0] // previous started flow. Take that and call screenFlowPrevious somehow. I think this only works for 2 levels
    };

    dispatch({ type: SCREEN_FLOW_START, flowState });
    dispatch(navigatePush(flowState.screen));
  };
}

export function screenFlowNext(payload = {}) {
  return (dispatch, getState) => {
    const {
      screenFlow: { current: currentScreenFlow },
    } = getState();
    const flowState = getNextFlowState(currentScreenFlow, payload);

    dispatch({ type: SCREEN_FLOW_NEXT, flowState });
    dispatch(navigatePush(flowState.screen));
  };
}

export function screenFlowPrevious() {
  return (dispatch, getState) => {
    const {
      screenFlow: { current: currentScreenFlow },
    } = getState();

    currentScreenFlow.backAction(); // Action to perform when leaving this screen (undo changes, logout, update redux, prompt before going back, etc). No effect if skipHistory is also enabled.
    dispatch({ type: SCREEN_FLOW_PREVIOUS });
    dispatch(navigateBack());
  };
}

function getNextFlowState(
  { flow: currentFlow, screen: currentScreen },
  payload,
) {
  switch (currentFlow) {
    case AuthenticateFlow:
      return authenticateFlowNext(currentScreen, payload);

    default:
      return null;
  }
}

// WELCOME_SCREEN
// SETUP_SCREEN
