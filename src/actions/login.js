import { getPerson } from './person';
import { navigatePush } from './navigation';
import { logInAnalytics } from './analytics';
import { ADD_SOMEONE_SCREEN } from '../containers/AddSomeoneScreen';
import { GET_STARTED_SCREEN } from '../containers/GetStartedScreen';
import { MAIN_TABS } from '../constants';

export function onSuccessfulLogin() {
  return async(dispatch, getState) => {
    dispatch(logInAnalytics());

    const personId = getState().auth.personId;
    const getMeResult = await dispatch(getPerson(personId));

    let nextScreen = GET_STARTED_SCREEN;
    if (getMeResult.findAll('user')[0].pathway_stage_id) {

      if (hasPersonWithStageSelected(getMeResult.find('person', personId))) {
        nextScreen = MAIN_TABS;
      } else {
        nextScreen = ADD_SOMEONE_SCREEN;
      }
    }

    return dispatch(navigatePush(nextScreen));
  };
}

function hasPersonWithStageSelected(person) {
  return person.contact_assignments.some((contact) => contact.pathway_stage_id);
}
