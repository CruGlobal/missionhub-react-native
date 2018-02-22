import { REHYDRATE } from 'redux-persist/constants';

import { REQUESTS } from '../actions/api';
import { LOGOUT, PEOPLE_WITH_ORG_SECTIONS } from '../constants';
import { findAllNonPlaceHolders, useFirstExists } from '../utils/common';

const initialState = {
  all: [],
  allByOrg: [],
  noteIds: [],
};

function peopleReducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      var incoming = action.payload.people;
      if (incoming) {
        return {
          all: useFirstExists(incoming.all, state.all),
          allByOrg: useFirstExists(incoming.allByOrg, state.allByOrg),
          noteIds: useFirstExists(incoming.noteIds, state.noteIds),
        };
      }
      return state;
    case REQUESTS.GET_PEOPLE_LIST.SUCCESS:
      const people = findAllNonPlaceHolders(action.results, 'person');
      return {
        ...state,
        all: people,
      };
    case REQUESTS.ADD_PERSON_NOTES.SUCCESS:
      console.log(action.results);
      const personId = action.results.findAll('person')[0].id;
      const noteId = action.results.findAll('person_note')[0].id;
      console.log(`Add Person Notes Success: ${personId}, ${noteId}`);
      return {
        ...state,
        noteIds: [ ...state.noteIds, { personId, noteId } ],
      };
    case LOGOUT:
      return initialState;
    case PEOPLE_WITH_ORG_SECTIONS:
      return {
        ...state,
        allByOrg: action.myOrgs,
      };
    default:
      return state;
  }
}

export default peopleReducer;