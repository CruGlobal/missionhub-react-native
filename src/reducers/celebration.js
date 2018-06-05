import { REQUESTS } from '../actions/api';

const initialCelebrationState = {};

function celebrationReducer(state = initialCelebrationState, action) {
  const results = action.results;

  switch (action.type) {
    case REQUESTS.GET_GROUP_CELEBRATE_FEED.SUCCESS:
      console.log(results);
      return {
        ...state,
      };
    case LOGOUT:
      return initialCelebrationState;
    default:
      return state;
  }
}

export default celebrationReducer;
