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
    if (!noteId) {
      console.log('add person note');
      return dispatch(callApi(REQUESTS.ADD_PERSON_NOTES, {}, bodyData));
    }
    console.log('update person note');
    return dispatch(callApi(REQUESTS.UPDATE_PERSON_NOTES, { noteId }, bodyData));
  };
}

export function getPersonNotes(personId, noteId) {
  return async(dispatch) => {
    const results = await dispatch(getPersonWithNotes(personId));
    console.log(results);
    return results.find('person', personId).person_notes.find('person_note', noteId);
    //should return note text and note id
  };
}

export function getPersonWithNotes(id) {
  return async(dispatch) => {
    const query = { person_id: id, include: 'person_notes' };
    return await dispatch(callApi(REQUESTS.GET_PERSON_NOTES, query));
  };
}