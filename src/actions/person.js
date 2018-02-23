import callApi, { REQUESTS } from './api';
import { PERSON_FIRST_NAME_CHANGED, PERSON_LAST_NAME_CHANGED, RESET_ONBOARDING_PERSON } from '../constants';

export function personFirstNameChanged(firstName) {
  return {
    type: PERSON_FIRST_NAME_CHANGED,
    personFirstName: firstName,
  };
}

export function personLastNameChanged(lastName) {
  return {
    type: PERSON_LAST_NAME_CHANGED,
    personLastName: lastName,
  };
}

export function savePersonNote(personId, notes, noteId, myId) {
  return (dispatch) => {
    if (!personId || !notes) {
      return Promise.reject('InvalidData', personId, notes);
    }

    const bodyData = {
      data: {
        type: 'person_note',
        attributes: {
          content: notes,
        },
        relationships: {
          person: {
            data: {
              type: 'person',
              id: personId,
            },
          },
          user: {
            data: {
              type: 'user',
              id: myId,
            },
          },
        },
      },
    };

    if (!noteId) {
      return dispatch(callApi(REQUESTS.ADD_PERSON_NOTES, {}, bodyData));
    }
    return dispatch(callApi(REQUESTS.UPDATE_PERSON_NOTES, { noteId }, bodyData));
  };
}

export function getPersonNote(personId, myId) {
  return async(dispatch) => {
    const query = { person_id: personId, include: 'person_notes' };

    return await dispatch(callApi(REQUESTS.GET_PERSON_NOTES, query)).then((results) => {
      console.log(results);
      if (results && results.find('person', personId) && results.find('person', personId).person_notes) {
        const notes = results.find('person', personId).person_notes;
        return notes.find((element) => { return element.user_id == myId; });
      }
      return Promise.reject('PersonNotFound', personId, myId);
    });
  };
}

export function resetPerson() {
  return { type: RESET_ONBOARDING_PERSON };
}