
import { PERSON_FIRST_NAME_CHANGED, PERSON_LAST_NAME_CHANGED, RESET_ONBOARDING_PERSON } from '../../src/constants';
import { REQUESTS } from '../../src/actions/api';
import { personFirstNameChanged, personLastNameChanged, savePersonNote, getPersonNote, resetPerson } from '../../src/actions/person';
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
  let action;

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


    beforeEach(() => {
      noteId = null;
      action = { type: 'added note' };
      const expectedQuery = { };

      store = mockStore();
      mockApi(action, REQUESTS.ADD_PERSON_NOTE, expectedQuery, expectedData);
    });

    it('should add note', () => {
      store.dispatch(savePersonNote(personId, note, noteId, myId));

      expect(store.getActions()[0]).toBe(action);
    });
  });

  describe('UpdatePersonNote', () => {
    beforeEach(() => {
      noteId = 2;
      action = { type: 'updated note' };
      const expectedQuery = { noteId };

      store = mockStore();
      mockApi(action, REQUESTS.UPDATE_PERSON_NOTE, expectedQuery, expectedData);
    });

    it('should update note', () => {
      store.dispatch(savePersonNote(personId, note, noteId, myId));

      expect(store.getActions()[0]).toBe(action);
    });
  });
});

describe('GetPersonNote', () => {
  const personId = 23;
  const myId = 1;

  const action = { type: 'got note' };

  const expectedQuery = { person_id: personId, include: 'person_notes' };

  beforeEach(() => {
    store = mockStore();
    mockApi(action, REQUESTS.GET_PERSON_NOTE, expectedQuery);
  });

  it('should get note', () => {
    store.dispatch(getPersonNote(personId, myId));

    expect(store.getActions()[0]).toBe(action);
  });
});


describe('resetPerson', () => {
  it('should return the correct action', () => {
    expect(resetPerson()).toEqual({
      type: RESET_ONBOARDING_PERSON,
    });
  });
});
