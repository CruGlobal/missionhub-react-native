import callApi, { REQUESTS } from './api';
import { PERSON_FIRST_NAME_CHANGED, PERSON_LAST_NAME_CHANGED } from '../constants';


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

export function saveNotes(personId, notes, firstSave) {
  return (dispatch, getState) => {
    const myId = getState().auth.personId;
    if (!personId || !notes) {
      return Promise.reject('InvalidData', personId, notes);
    }

    const bodyData = {
      data: {
        type: 'person_note',
        attributes: {
          content: notes,
        },
      },
      relationships: {
        person: {
          data: {
            type: 'person',
            id: personId,
          },
        },
      },
      user: {
        data: {
          type: 'user',
          id: myId,
        },
      },
    };

    const query = {};

    if (firstSave) return dispatch(callApi(REQUESTS.ADD_PERSON_NOTES, query, bodyData));
    return dispatch(callApi(REQUESTS.UPDATE_PERSON_NOTES, query, bodyData));
  };
}