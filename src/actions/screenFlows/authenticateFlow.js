import { LOGIN_SCREEN } from '../../containers/LoginScreen';
import { LOGIN_OPTIONS_SCREEN } from '../../containers/LoginOptionsScreen';
import { KEY_LOGIN_SCREEN } from '../../containers/KeyLoginScreen';
import { nextFlow } from './helpers';

export const AuthenticateFlow = 'AUTHENTICATE_FLOW';

export function authenticateFlowNext(currentScreen, payload) {
  const authenticateNext = nextFlow(AuthenticateFlow);

  switch (currentScreen) {
    case LOGIN_SCREEN: // Main landing screen
      return payload.signIn
        ? authenticateNext(KEY_LOGIN_SCREEN)
        : authenticateNext(LOGIN_OPTIONS_SCREEN);
    case LOGIN_OPTIONS_SCREEN: // Sign up/try it now
      // TODO: change flows
      return null;
    default:
      return authenticateNext(LOGIN_SCREEN);
  }
}

const screenFlowConfig = {
  LOGIN_SCREEN: {
    next: ({ signIn }) => (signIn ? KEY_LOGIN_SCREEN : LOGIN_OPTIONS_SCREEN),
  },
  LOGIN_OPTIONS_SCREEN: {
    next: (payload, dispatch, getState) => {
      doAnalyticsThing();

      return 'Screen3';
    },
    previous: 2, // times
  },
  Screen3: {
    nextScreen: (payload, dispatch, getState) => {
      doAnalyticsThing();

      return { flow: Onboarding, screen: 'Screen2' };
    },
    previousScreen: 'Screen 0',
  },
  Screen4: {
    nextScreen: (payload, dispatch, getState) => {
      doAnalyticsThing();

      return { flow: Onboarding, screen: 'Screen2' };
    },
    previousScreen: 'Screen 0',
  },
};
