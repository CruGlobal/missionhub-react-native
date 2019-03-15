import {
  LOGOUT,
  SET_CELEBRATE_EDITING_COMMENT,
  RESET_CELEBRATE_EDITING_COMMENT,
} from '../constants';
import { REQUESTS } from '../actions/api';
import { getPagination } from '../utils/common';

const initialState = {
  all: {},
  reportItems: [],
  editingCommentId: null,
};

export default function celebrateCommentsReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTS.GET_CELEBRATE_COMMENTS.SUCCESS:
      return addCommentsToState(state, action);
    case REQUESTS.CREATE_CELEBRATE_COMMENT.SUCCESS:
      return addCreatedCommentToState(state, action);
    case REQUESTS.UPDATE_CELEBRATE_COMMENT.SUCCESS:
      return editCommentsInState(state, action);
    case REQUESTS.DELETE_CELEBRATE_COMMENT.SUCCESS:
      return removeCommentFromState(state, action);
    case REQUESTS.GET_REPORTED_COMMENTS.SUCCESS:
      return {
        ...state,
        reportItems: action.results,
      };
    case SET_CELEBRATE_EDITING_COMMENT:
      return {
        ...state,
        editingCommentId: action.commentId,
      };
    case RESET_CELEBRATE_EDITING_COMMENT:
      return {
        ...state,
        editingCommentId: null,
      };
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

  const event = state.all[eventId];
  const comments = page ? [...event.comments, ...response] : response;

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
  const {
    results: { response },
    query: { eventId },
  } = action;

  const event = state.all[eventId];
  const comments = [...event.comments, response];

  return {
    ...state,
    all: {
      ...state.all,
      [eventId]: {
        ...event,
        comments,
      },
    },
  };
}

function removeCommentFromState(state, action) {
  const {
    query: { eventId, commentId },
  } = action;

  const event = state.all[eventId];
  const comments = event.comments.filter(c => c.id !== commentId);

  return {
    ...state,
    all: {
      ...state.all,
      [eventId]: {
        ...event,
        comments,
      },
    },
  };
}

function editCommentsInState(state, action) {
  const {
    results: { response },
    query: { eventId, commentId },
  } = action;

  const event = state.all[eventId];
  const comments = event.comments.map(c => (c.id === commentId ? response : c));

  return {
    ...state,
    all: {
      ...state.all,
      [eventId]: {
        ...event,
        comments,
      },
    },
  };
}
