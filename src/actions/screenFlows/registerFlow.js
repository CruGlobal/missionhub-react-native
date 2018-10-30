import { LOGIN_SCREEN } from '../../containers/LoginScreen';
import { LOGIN_OPTIONS_SCREEN } from '../../containers/LoginOptionsScreen';
import { KEY_LOGIN_SCREEN } from '../../containers/KeyLoginScreen';
import { SCREEN_FLOW_INITIAL_SCREEN } from '../../constants';

export const RegisterFlow = 'REGISTER_FLOW';

export const RegisterFlowConfig = () => ({
  [SCREEN_FLOW_INITIAL_SCREEN]: LOGIN_OPTIONS_SCREEN,
  [LOGIN_OPTIONS_SCREEN]: {
    // TODO: update
    onNext: ({ signIn }) => (signIn ? KEY_LOGIN_SCREEN : LOGIN_OPTIONS_SCREEN),
  },
});
