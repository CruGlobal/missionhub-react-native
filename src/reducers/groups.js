import { REHYDRATE } from 'redux-persist/constants';

import { REQUESTS } from '../actions/api';
import { LOGOUT } from '../constants';

const initialState = {
  all: [],
};

function groupsReducer(state = initialState, action) {
  const results = action.results;
  switch (action.type) {
    case REHYDRATE:
      var incoming = action.payload.groups;
      if (incoming) {
        return {
          ...state,
          ...incoming,
        };
      }
      return state;
    case REQUESTS.GET_MY_GROUPS.SUCCESS:
      const groups = (results.findAll('group') || []).map((g) => ({ text: g.name, ...g }));
      return {
        ...state,
        all: groups,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default groupsReducer;