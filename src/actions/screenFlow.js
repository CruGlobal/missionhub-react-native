import { navigatePush, navigateBack } from './navigation';
import { KEY_LOGIN_SCREEN } from '../containers/KeyLoginScreen';
import { WELCOME_SCREEN } from '../containers/WelcomeScreen';
import { SETUP_SCREEN } from '../containers/SetupScreen';
import {
  SCREEN_FLOW_START,
  SCREEN_FLOW_FINISH,
  SCREEN_FLOW_NEXT,
  SCREEN_FLOW_BACK,
  INITIAL_SCREEN,
  SCREEN_FLOW_CLEAR_ALL,
} from '../constants';
import {
  AUTHENTICATE_FLOW,
  AuthenticateFlowConfig,
} from './screenFlows/authenticateFlow';
import {
  activeScreenConfig,
  activeFlowName,
  activeScreenName,
  previousScreens,
  previousFlow,
  activeScreen,
} from '../selectors/screenFlow';

export function screenFlowStart(flowName, payload) {
  return (dispatch, getState) => {
    const screen = getNextScreen(
      flowName,
      INITIAL_SCREEN,
      payload,
      dispatch,
      getState,
    );

    dispatch({ type: SCREEN_FLOW_START, flowName, screen });
    dispatch(navigatePush(screen, payload));
  };
}

export function screenFlowClearAll() {
  return { type: SCREEN_FLOW_CLEAR_ALL };
}

export function screenFlowNext(payload = {}) {
  return (dispatch, getState) => {
    const { screenFlow } = getState();

    let screen = getNextScreen(
      screenFlow.flowName,
      activeScreen(screenFlow),
      payload,
      dispatch,
      getState,
    );

    // TODO: while to handle multiple ending at once? Check if the flow that is finishing is the root flow and perform some stored behavior.
    if (screen.flowFinished) {
      screen = getNextScreen(
        screenFlow.flowName,
        screen.flowFinished,
        screen.payload,
        dispatch,
        getState,
      );
    }

    dispatch({ type: SCREEN_FLOW_NEXT, screen });
    dispatch(navigatePush(screen, payload));
  };
}

export function screenFlowBack(payload = {}) {
  return (dispatch, getState) => {
    const { screenFlow } = getState();

    const times = getBackCount(
      screenFlow.flowName,
      activeScreen(screenFlow),
      payload,
      dispatch,
      getState,
    );

    dispatch({ type: SCREEN_FLOW_BACK, times });
    dispatch(navigateBack(times));
  };
}

function getNextScreen(flowName, currentScreen, payload, dispatch, getState) {
  const screenConfig = lookupFlowConfig(flowName)[currentScreen];

  const { next } = screenConfig;

  if (typeof next === 'string') {
    return next;
  } else if (typeof next === 'function') {
    return next(payload, dispatch, getState);
  }
}

function getBackCount(flowName, currentScreen, payload, dispatch, getState) {
  const screenConfig = lookupFlowConfig(flowName)[currentScreen];

  const { back } = screenConfig;

  if (typeof next === 'number') {
    return back;
  } else if (typeof back === 'function') {
    return back(payload, dispatch, getState);
  }
}

function lookupFlowConfig(flowName) {
  switch (flowName) {
    case AUTHENTICATE_FLOW:
      return AuthenticateFlowConfig();
  }
}
