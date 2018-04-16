import { Crashlytics } from 'react-native-fabric';
import { getMe } from './person';
import { navigateReset } from './navigation';
import { logInAnalytics } from './analytics';
import { ADD_SOMEONE_SCREEN } from '../containers/AddSomeoneScreen';
import { GET_STARTED_SCREEN } from '../containers/GetStartedScreen';
import { MAIN_TABS } from '../constants';

export function onSuccessfulLogin() {
  return async(dispatch, getState) => {
    dispatch(logInAnalytics());

    const { person: { id: personId } } = getState().auth;
    Crashlytics.setUserIdentifier(personId);

    const mePerson = await dispatch(getMe('contact_assignments'));

    let nextScreen = GET_STARTED_SCREEN;
    if (mePerson.user.pathway_stage_id) {

      if (hasPersonWithStageSelected(mePerson)) {
        nextScreen = MAIN_TABS;
      } else {
        nextScreen = ADD_SOMEONE_SCREEN;
      }
    }

    return dispatch(navigateReset(nextScreen));
  };
}

function hasPersonWithStageSelected(person) {
  return person.contact_assignments.some((contact) => contact.pathway_stage_id);
}
