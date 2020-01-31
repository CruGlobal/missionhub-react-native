import { REQUESTS } from '../api/routes';
import { LOGOUT } from '../constants';

const initialState = {
  all: [],
};

// @ts-ignore
function surveysReducer(state = initialState, action) {
  const results = action.results;
  switch (action.type) {
    case REQUESTS.GET_SURVEYS.SUCCESS:
      // @ts-ignore
      const surveys = (results.findAll('survey') || []).map(s => ({
        text: s.title,
        ...s,
      }));
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
