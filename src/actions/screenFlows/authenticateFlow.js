import { LOGIN_SCREEN } from '../../containers/LoginScreen';
import { ACTIONS, MAIN_TABS, INITIAL_SCREEN } from '../../constants';
import { SIGN_IN_FLOW, SignInFlowConfig } from './signInFlow';
import { RegisterFlowConfig } from './registerFlow';
import { completeOnboarding } from '../onboardingProfile';
import { ADD_SOMEONE_SCREEN } from '../../containers/AddSomeoneScreen';
import { GET_STARTED_SCREEN } from '../../containers/GetStartedScreen';
import { trackActionWithoutData } from '../analytics';

export const AUTHENTICATE_FLOW = 'AUTHENTICATE_FLOW';

export const AuthenticateFlowConfig = () => {
  return {
    ...SignInFlowConfig(),
    ...RegisterFlowConfig(),
    [INITIAL_SCREEN]: { next: LOGIN_SCREEN },
    [LOGIN_SCREEN]: {
      next: ({ signIn }) =>
        signIn
          ? SignInFlowConfig()[INITIAL_SCREEN].next
          : RegisterFlowConfig()[INITIAL_SCREEN].next,
    },
    [SIGN_IN_FLOW]: {
      next: ({ mePerson }, dispatch) =>
        firstScreenOfOnboarding(mePerson, dispatch),
    },
  };
};

function firstScreenOfOnboarding(mePerson, dispatch) {
  if (mePerson.user.pathway_stage_id) {
    if (hasPersonWithStageSelected(mePerson)) {
      dispatch(completeOnboarding());
      return MAIN_TABS;
    } else {
      trackOnboardingStartedAction(dispatch);
      return ADD_SOMEONE_SCREEN;
    }
  } else {
    trackOnboardingStartedAction(dispatch);
    return GET_STARTED_SCREEN;
  }
}

function hasPersonWithStageSelected(person) {
  return person.contact_assignments.some(contact => contact.pathway_stage_id);
}

function trackOnboardingStartedAction(dispatch) {
  dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_STARTED));
}
