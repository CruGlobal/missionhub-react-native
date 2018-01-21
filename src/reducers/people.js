import { REHYDRATE } from 'redux-persist/constants';

import { REQUESTS } from '../actions/api';
import { LOGOUT, PEOPLE_WITH_ORG_SECTIONS } from '../constants';
import { findAllNonPlaceHolders, useFirstExists } from '../utils/common';

const initialState = {
  all: [],
  allByOrg: [],
};

function peopleReducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      var incoming = action.payload.people;
      if (incoming) {
        return {
          all: useFirstExists(incoming.all, state.all),
          allByOrg: useFirstExists(incoming.allByOrg, state.allByOrg),
        };
      }
      return state;
    case REQUESTS.GET_PEOPLE_LIST.SUCCESS:
      const people = findAllNonPlaceHolders(action.results, 'person');
      return {
        ...state,
        all: people,
      };
    case LOGOUT:
      return initialState;
    case PEOPLE_WITH_ORG_SECTIONS:
      return {
        ...state,
        allByOrg: action.sections,
      };
    default:
      return state;
  }
}

export default peopleReducer;