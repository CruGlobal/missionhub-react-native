import { LOGOUT } from '../constants';
import { REQUESTS } from '../actions/api';

const initialState = {
  all: {},
};

export default function celebrateCommentsReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTS.GET_CELEBRATE_COMMENTS.SUCCESS:
      const {
        results: { response },
        query: { eventId },
      } = action.results.response;

      //TODO pagination
      //TODO combine old items with new
      //TODO account for duplicate responses?

      return {
        ...state,
        all: {
          ...state.all,
          [eventId]: {
            comments: [...response],
          },
        },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
