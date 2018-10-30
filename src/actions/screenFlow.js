import { navigatePush, navigateBack } from './navigation';
import { KEY_LOGIN_SCREEN } from '../containers/KeyLoginScreen';
import { WELCOME_SCREEN } from '../containers/WelcomeScreen';
import { SETUP_SCREEN } from '../containers/SetupScreen';
import {
  SCREEN_FLOW_FINISH,
  SCREEN_FLOW_NEXT,
  SCREEN_FLOW_PREVIOUS,
  SCREEN_FLOW_INITIAL_SCREEN,
  SCREEN_FLOW_CLEAR_ALL,
} from '../constants';
import {
  AuthenticateFlow,
  AuthenticateFlowConfig,
} from './screenFlows/authenticateFlow';
import {
  activeScreenConfig,
  activeFlowName,
  activeScreenName,
  previousScreens,
  previousFlow,
} from '../selectors/screenFlow';

export function screenFlowStart(newFlow, onFinish, payload) {
  return (dispatch, getState) => {
    // TODO: Limitation: first screen of flow can't start new flow, could pass the start onFinish through if the next screen is undefined otherwise delegate calling the start onFinish to the flow config
    const { flow, screen } = getNextFlowState(
      newFlow,
      SCREEN_FLOW_INITIAL_SCREEN,
      payload,
      dispatch,
      getState,
    );

    dispatch({ type: SCREEN_FLOW_NEXT, flow, screen, onFinish });
    dispatch(navigatePush(screen));
  };
}

export function screenFlowClearAll() {
  return { type: SCREEN_FLOW_CLEAR_ALL };
}

export function screenFlowNext(payload = {}) {
  return (dispatch, getState) => {
    const { screenFlow } = getState();
    const result = getNextFlowState(
      activeFlowName(screenFlow),
      activeScreenName(screenFlow),
      payload,
      dispatch,
      getState,
    );
    if (
      result === SCREEN_FLOW_FINISH &&
      activeScreenConfig(screenFlow).onFinish
    ) {
      activeScreenConfig(screenFlow).onFinish(payload, dispatch, getState);
    } else {
      const { flow, screen, onFinish } = result;
      if (flow === activeFlowName(screenFlow)) {
        dispatch({ type: SCREEN_FLOW_NEXT, flow, screen, onFinish });
        dispatch(navigatePush(screen));
      } else {
        const { screen } = getNextFlowState(
          flow,
          SCREEN_FLOW_INITIAL_SCREEN,
          payload,
          dispatch,
          getState,
        );
        dispatch({ type: SCREEN_FLOW_NEXT, flow, screen, onFinish });
        dispatch(navigatePush(screen));
      }
    }
  };
}

// TODO: update to latest reducer and config schema
export function screenFlowPrevious(payload = {}) {
  return (dispatch, getState) => {
    const { screenFlow } = getState();

    const result = getPreviousFlowState(
      activeFlowName(screenFlow),
      activeScreenName(screenFlow),
      payload,
      dispatch,
      getState,
    );

    dispatch({ type: SCREEN_FLOW_PREVIOUS, times: result });
    dispatch(navigateBack(result));
  };
}

function getNextFlowState(
  currentFlow,
  currentScreen,
  payload,
  dispatch,
  getState,
) {
  const continueCurrentFlow = screen => ({
    flow: currentFlow,
    screen,
  });
  const result = getFlowHandlersForScreen(currentFlow, currentScreen);

  if (typeof result === 'string') {
    return continueCurrentFlow(result);
  } else {
    const { onNext } = result || {};

    if (typeof onNext === 'string') {
      return continueCurrentFlow(onNext);
    } else if (typeof onNext === 'function') {
      const result = onNext(payload, dispatch, getState);
      return typeof result === 'string' ? continueCurrentFlow(result) : result;
    }
  }
  return SCREEN_FLOW_FINISH;
}

function getPreviousFlowState(
  currentFlow,
  currentScreen,
  payload,
  dispatch,
  getState,
) {
  const result = getFlowHandlersForScreen(currentFlow, currentScreen);

  if (typeof result === 'string') {
    return 1;
  } else {
    const { onPrevious } = result || {};

    if (typeof onPrevious === 'number') {
      return onPrevious;
    } else if (typeof onPrevious === 'function') {
      const result = onPrevious(payload, dispatch, getState);
      return typeof result === 'number' ? result : 1;
    }
  }
  return 1;
}

function getFlowHandlersForScreen(currentFlow, currentScreen) {
  switch (currentFlow) {
    case AuthenticateFlow:
      return AuthenticateFlowConfig()[currentScreen];
    default:
      return null;
  }
}
