
import { PERSON_FIRST_NAME_CHANGED, PERSON_LAST_NAME_CHANGED, RESET_ONBOARDING_PERSON } from '../../src/constants';
import { REQUESTS } from '../../src/actions/api';
import { personFirstNameChanged, personLastNameChanged, savePersonNote, resetPerson } from '../../src/actions/person';
import * as api from '../../src/actions/api';
import configureStore from 'redux-mock-store';
import { mockFnWithParams } from '../../testUtils';
import thunk from 'redux-thunk';


const mockStore = configureStore([ thunk ]);
let store;

const mockApi = (result, ...expectedParams) => mockFnWithParams(api, 'default', result, ...expectedParams);

describe('personFirstNameChanged', () => {
  it('should return the correct action', () => {
    expect(personFirstNameChanged('test')).toEqual({
      type: PERSON_FIRST_NAME_CHANGED,
      personFirstName: 'test',
    });
  });
});

describe('personLastNameChanged', () => {
  it('should return the correct action', () => {
    expect(personLastNameChanged('test')).toEqual({
      type: PERSON_LAST_NAME_CHANGED,
      personLastName: 'test',
    });
  });
});

describe('saveNote', () => {
  const personId = 23;
  const myId = 1;
  const note = 'test';
  let noteId;

  const expectedData = {
    data: {
      type: 'person_note',
      attributes: {
        content: note,
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

  describe('AddPersonNote', () => {
    noteId = null;

    const action = { type: 'added notes' };

    beforeEach(() => {
      store = mockStore({ auth: { user: { user: { id: myId } } } });
      mockApi(action, REQUESTS.ADD_PERSON_NOTES, { }, expectedData);
    });

    it('should add notes', () => {
      store.dispatch(savePersonNote(personId, note, noteId));

      expect(store.getActions()[0]).toBe(action);
    });
  });

  describe('UpdatePersonNotes', () => {
    noteId = 2;

    const action = { type: 'updated notes' };

    beforeEach(() => {
      store = mockStore({ auth: { user: { user: { id: myId } } } });
      mockApi(action, REQUESTS.UPDATE_PERSON_NOTES, { noteId }, expectedData);
    });

    it('should update notes', () => {
      store.dispatch(savePersonNote(personId, note, noteId));

      expect(store.getActions()[0]).toBe(action);
    });
  });
});


describe('resetPerson', () => {
  it('should return the correct action', () => {
    expect(resetPerson()).toEqual({
      type: RESET_ONBOARDING_PERSON,
    });
  });
});
