import { getPerson } from './people';
import { navigatePush } from './navigation';
import { updateLoggedInStatus } from './analytics';

export function onSuccessfulLogin() {
  return async(dispatch, getState) => {
    dispatch(updateLoggedInStatus(true));

    const personId = getState().auth.personId;
    const getMeResult = await dispatch(getPerson(personId));

    let nextScreen = 'GetStarted';
    if (getMeResult.findAll('user')[0].pathway_stage_id) {

      if (hasPersonWithStageSelected(getMeResult.find('person', personId))) {
        nextScreen = 'MainTabs';
      } else {
        nextScreen = 'AddSomeone';
      }
    }

    return dispatch(navigatePush(nextScreen));
  };
}

function hasPersonWithStageSelected(person) {
  return person.contact_assignments.some((contact) => contact.pathway_stage_id);
}