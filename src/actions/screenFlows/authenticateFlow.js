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
