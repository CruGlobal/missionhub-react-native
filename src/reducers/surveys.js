import { REHYDRATE } from 'redux-persist/constants';

import { REQUESTS } from '../actions/api';
import { LOGOUT } from '../constants';

const initialState = {
  all: [],
};

function surveysReducer(state = initialState, action) {
  const results = action.results;
  switch (action.type) {
    case REHYDRATE:
      var incoming = action.payload.surveys;
      if (incoming) {
        return {
          ...state,
          ...incoming,
        };
      }
      return state;
    case REQUESTS.GET_MY_SURVEYS.SUCCESS:
      const surveys = results.findAll('survey') || [];
      return {
        ...state,
        all: surveys,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default surveysReducer;