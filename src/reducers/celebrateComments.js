import { LOGOUT } from '../constants';
import { REQUESTS } from '../actions/api';

const initialState = {
  all: {},
};

export default function celebrateCommentsReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTS.CREATE_CELEBRATE_COMMENT.SUCCESS:
      const response = action.results.response;

      return {
        ...state,
        all: {
          ...state.all,
          [response.id]: response,
        },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
