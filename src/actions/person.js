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

export function savePersonNotes(personId, notes, noteId) {
  return (dispatch, getState) => {
    const myId = getState().auth.personId;
    if (!personId || !notes) {
      console.log('invalid');
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

    console.log('ready to send');
    if (!noteId) return dispatch(callApi(REQUESTS.ADD_PERSON_NOTES, {}, bodyData));
    return dispatch(callApi(REQUESTS.UPDATE_PERSON_NOTES, { myId }, bodyData));
  };
}

export function getPersonNotes(personId) {
  return async(dispatch, getState) => {
    const myId = getState().auth.personId;
    const results = await dispatch(getPersonWithNotes(personId));
    const note = results.find('person', personId).person_notes.find('person_note', myId);
    return { note };
    //should return note text and note id
  };
}

export function getPersonWithNotes(id) {
  return async(dispatch) => {
    const query = { person_id: id, include: 'person_notes' };
    return await dispatch(callApi(REQUESTS.GET_PERSON_NOTES, query));
  };
}