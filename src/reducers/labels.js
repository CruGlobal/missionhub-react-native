import { REQUESTS } from '../actions/api';
import { LOGOUT } from '../constants';

const initialState = {
  all: [],
};

function labelsReducer(state = initialState, action) {
  const results = action.results;
  switch (action.type) {
    case REQUESTS.GET_MY_LABELS.SUCCESS:
      const labels = (results.findAll('label') || []).map(l => ({
        text: l.name,
        ...l,
      }));
      return {
        ...state,
        all: labels,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default labelsReducer;
