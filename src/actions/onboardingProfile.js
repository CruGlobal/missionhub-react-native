import uuidv4 from 'uuid/v4';
import { Crashlytics } from 'react-native-fabric';

import { COMPLETE_ONBOARDING } from '../constants';

import callApi, { REQUESTS } from './api';

/*
A user is considered to have completed onboarding once they've:
1) selected a stage for themselves, and
2) selected a stage for a contact assignment
 */
// TODO: is this needed? Can it be computed by looking at auth.person?
export function completeOnboarding() {
  return { type: COMPLETE_ONBOARDING };
}

export function createMyPerson(firstName, lastName) {
  const data = {
    code: uuidv4(),
    first_name: firstName,
    last_name: lastName,
  };

  return async dispatch => {
    const me = await dispatch(callApi(REQUESTS.CREATE_MY_PERSON, {}, data));
    Crashlytics.setUserIdentifier(`${me.person_id}`);
    return me;
  };
}

export function createPerson(firstName, lastName, myId) {
  const data = {
    data: {
      type: 'person',
      attributes: {
        first_name: firstName,
        last_name: lastName,
      },
    },
    included: [
      {
        type: 'contact_assignment',
        attributes: {
          assigned_to_id: myId,
        },
      },
    ],
  };

  return dispatch => {
    return dispatch(callApi(REQUESTS.ADD_NEW_PERSON, {}, data));
  };
}
