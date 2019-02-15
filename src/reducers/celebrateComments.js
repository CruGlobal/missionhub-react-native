import { LOGOUT } from '../constants';
import { REQUESTS } from '../actions/api';
import { getPagination } from '../utils/common';

const initialState = {
  all: {},
};

export default function celebrateCommentsReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTS.GET_CELEBRATE_COMMENTS.SUCCESS:
      return addCommentsToState(state, action);
    case REQUESTS.CREATE_CELEBRATE_COMMENT.SUCCESS:
      return addCreatedCommentToState(state, action);
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

function addCommentsToState(state, action) {
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
}

function addCreatedCommentToState(state, action) {
  const response = action.results.response;
  const event = state.all[response.eventId];

  return {
    ...state,
    all: {
      ...state.all,
      [response.eventId]: {
        ...event,
        comments: [...event.comments, response],
      },
    },
  };
}
