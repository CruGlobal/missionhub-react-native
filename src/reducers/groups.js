import { REQUESTS } from '../actions/api';
import { LOGOUT, GET_GROUP_SURVEYS } from '../constants';

const initialState = {
  all: [],
  surveys: {}, // All surveys split up by orgId
};

function groupsReducer(state = initialState, action) {
  const results = action.results;
  switch (action.type) {
    case REQUESTS.GET_MY_GROUPS.SUCCESS:
      const groups = (results.findAll('group') || []).map(g => ({
        text: g.name,
        ...g,
      }));
      return {
        ...state,
        all: groups,
      };
    case GET_GROUP_SURVEYS:
      return {
        ...state,
        surveys: {
          ...state.surveys,
          [action.orgId]: action.surveys,
        },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default groupsReducer;
