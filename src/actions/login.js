import { Crashlytics } from 'react-native-fabric';
import * as RNOmniture from 'react-native-omniture';

import { ADD_SOMEONE_SCREEN } from '../containers/AddSomeoneScreen';
import { GET_STARTED_SCREEN } from '../containers/GetStartedScreen';
import { ACTIONS, MAIN_TABS } from '../constants';

import { getMe } from './person';
import { navigateReset } from './navigation';
import { logInAnalytics, trackActionWithoutData } from './analytics';
import { completeOnboarding } from './onboardingProfile';

export function onSuccessfulLogin() {
  return async (dispatch, getState) => {
    dispatch(logInAnalytics());

    const {
      person: { id: personId },
    } = getState().auth;
    Crashlytics.setUserIdentifier(personId);

    const mePerson = await dispatch(getMe('contact_assignments'));
    RNOmniture.syncIdentifier(mePerson.global_registry_mdm_id);

    let nextScreen;

    if (mePerson.user.pathway_stage_id) {
      if (hasPersonWithStageSelected(mePerson)) {
        nextScreen = MAIN_TABS;
        dispatch(completeOnboarding());
      } else {
        nextScreen = ADD_SOMEONE_SCREEN;
        dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_STARTED));
      }
    } else {
      nextScreen = GET_STARTED_SCREEN;
      dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_STARTED));
    }

    return dispatch(navigateReset(nextScreen));
  };
}

function hasPersonWithStageSelected(person) {
  return person.contact_assignments.some(contact => contact.pathway_stage_id);
}
