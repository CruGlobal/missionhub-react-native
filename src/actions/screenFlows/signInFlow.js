import { LOGIN_SCREEN } from '../../containers/LoginScreen';
import { LOGIN_OPTIONS_SCREEN } from '../../containers/LoginOptionsScreen';
import { KEY_LOGIN_SCREEN } from '../../containers/KeyLoginScreen';
import { SCREEN_FLOW_INITIAL_SCREEN } from '../../constants';

export const SignInFlow = 'SIGN_IN_FLOW';

export const SignInFlowConfig = () => ({
  [SCREEN_FLOW_INITIAL_SCREEN]: LOGIN_SCREEN,
  [LOGIN_SCREEN]: {
    onNext: ({ signIn }) => (signIn ? KEY_LOGIN_SCREEN : LOGIN_OPTIONS_SCREEN),
  },
  [LOGIN_OPTIONS_SCREEN]: {
    onNext: (payload, dispatch, getState) => {
      debugger;
    },
  },
});
