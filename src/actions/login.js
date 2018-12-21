import { Crashlytics } from 'react-native-fabric';
import * as RNOmniture from 'react-native-omniture';

import { ADD_SOMEONE_SCREEN } from '../containers/AddSomeoneScreen';
import { GET_STARTED_SCREEN } from '../containers/GetStartedScreen';
import { ACTIONS, MAIN_TABS } from '../constants';
import { rollbar } from '../utils/rollbar.config';

import { getMe } from './person';
import { navigateReset } from './navigation';
import { logInAnalytics, trackActionWithoutData } from './analytics';
import { completeOnboarding } from './onboardingProfile';

export function onSuccessfulLogin(onComplete) {
  return async (dispatch, getState) => {
    dispatch(logInAnalytics());

    const {
      person: { id: personId },
    } = getState().auth;
    Crashlytics.setUserIdentifier(personId);
    rollbar.setPerson(personId);

    const mePerson = await dispatch(getMe('contact_assignments'));
    RNOmniture.syncIdentifier(mePerson.global_registry_mdm_id);

    if (onComplete) {
      return onComplete();
    }

    let nextScreen;

    if (mePerson.user.pathway_stage_id) {
      if (hasPersonWithStageSelected(mePerson)) {
        nextScreen = MAIN_TABS;
        dispatch(completeOnboarding());
      } else {
        nextScreen = ADD_SOMEONE_SCREEN;
        trackOnboardingStartedAction(dispatch);
      }
    } else {
      nextScreen = GET_STARTED_SCREEN;
      trackOnboardingStartedAction(dispatch);
    }

    return dispatch(navigateReset(nextScreen));
  };
}

function hasPersonWithStageSelected(person) {
  return person.contact_assignments.some(contact => contact.pathway_stage_id);
}

function trackOnboardingStartedAction(dispatch) {
  dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_STARTED));
}
