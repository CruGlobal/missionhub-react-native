import { LOGOUT } from '../constants';
import { REQUESTS } from '../actions/api';
import { getPagination } from '../utils/common';

const initialState = {
  all: {},
};

export default function celebrateCommentsReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTS.GET_CELEBRATE_COMMENTS.SUCCESS:
      const {
        results: { response },
        query: { eventId, page },
      } = action;

      const event = state.all[eventId] || {};
      const existingComments = event.comments || [];
      const comments = page ? [...existingComments, ...response] : response;

      return {
        ...state,
        all: {
          ...state.all,
          [eventId]: {
            ...event,
            comments,
            pagination: getPagination(action, comments.length),
          },
        },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
