import { REQUESTS } from '../api/routes';
import { LOGOUT } from '../constants';

const initialState = {
  all: [],
};

// @ts-ignore
function groupsReducer(state = initialState, action) {
  const results = action.results;
  switch (action.type) {
    case REQUESTS.GET_MY_GROUPS.SUCCESS:
      // @ts-ignore
      const groups = (results.findAll('group') || []).map(g => ({
        text: g.name,
        ...g,
      }));
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
