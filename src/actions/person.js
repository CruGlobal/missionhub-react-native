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

export function savePersonNotes(personId, notes, noteId) {
  return (dispatch, getState) => {
    const myId = getState().auth.user.user.id;
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

export function getPersonNotes(personId, noteId) {
  return async(dispatch) => {
    const results = await dispatch(getPersonWithNotes(personId));
    return results.find('person_note', noteId);
  };
}

export function getPersonWithNotes(id) {
  return async(dispatch) => {
    const query = { person_id: id, include: 'person_notes' };
    return await dispatch(callApi(REQUESTS.GET_PERSON_NOTES, query));
  };
}

export function resetPerson() {
  return { type: RESET_ONBOARDING_PERSON };
}