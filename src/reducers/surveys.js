import { REQUESTS } from '../actions/api';
import { LOGOUT } from '../constants';

const initialState = {
  all: [],
};

export default function surveysReducer(state = initialState, action) {
  const results = action.results;
  switch (action.type) {
    case REQUESTS.GET_SURVEYS.SUCCESS:
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
