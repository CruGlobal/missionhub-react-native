import { KEY_LOGIN_SCREEN } from '../../containers/KeyLoginScreen';
import { MAIN_TABS, INITIAL_SCREEN } from '../../constants';
import { MFA_CODE_SCREEN } from '../../containers/MFACodeScreen';
import { completeOnboarding } from '../onboardingProfile';
import { ADD_SOMEONE_SCREEN } from '../../containers/AddSomeoneScreen';
import { GET_STARTED_SCREEN } from '../../containers/GetStartedScreen';
import { navigateReset } from '../navigation';

export const SIGN_IN_FLOW = 'SIGN_IN_FLOW';

export const SignInFlowConfig = finish => ({
  [INITIAL_SCREEN]: { next: KEY_LOGIN_SCREEN },
  [KEY_LOGIN_SCREEN]: {
    next: ({ requiresMFA, mePerson }, dispatch, getState) => {
      if (requiresMFA) {
        return MFA_CODE_SCREEN;
      }
      return finish({ mePerson }, dispatch, getState);
    },
  },
  [MFA_CODE_SCREEN]: {
    next: ({ mePerson }) => ({
      flowFinished: SIGN_IN_FLOW,
      payload: { mePerson },
    }),
  },
});
