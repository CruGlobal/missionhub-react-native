import { LOGIN_OPTIONS_SCREEN } from '../../containers/LoginOptionsScreen';
import { INITIAL_SCREEN } from '../../constants';

export const RegisterFlowConfig = () => ({
  [INITIAL_SCREEN]: { next: LOGIN_OPTIONS_SCREEN },
  [LOGIN_OPTIONS_SCREEN]: {
    next: ({ signIn }) => {
      debugger;
    },
  },
});
