import { REHYDRATE } from 'redux-persist/constants';

import { REQUESTS } from '../actions/api';
import { LOGOUT } from '../constants';

const initialState = {
  all: [],
};

function peopleReducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      var incoming = action.payload.people;
      if (incoming) {
        return {
          ...state,
          ...incoming,
        };
      }
      return state;
    case REQUESTS.GET_PEOPLE_LIST.SUCCESS:
      const people = action.results.findAll('person') || [];
      return {
        ...state,
        all: people,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default peopleReducer;