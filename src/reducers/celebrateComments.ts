import { AnyAction } from 'redux';

import {
  LOGOUT,
  SET_CELEBRATE_EDITING_COMMENT,
  RESET_CELEBRATE_EDITING_COMMENT,
} from '../constants';
import { REQUESTS } from '../api/routes';
import { getPagination } from '../utils/common';

import { PaginationObject } from './organizations';
import { Person } from './people';

export interface CelebrateComment {
  id: string;
  updated_at: string;
  created_at: string;
  content: string;
  person: Person;
}

export interface CelebrateCommentsState {
  all: {
    [key in string]: {
      comments: CelebrateComment[];
      pagination: PaginationObject;
    };
  };
  editingCommentId: string | null;
}

const initialState: CelebrateCommentsState = {
  all: {},
  editingCommentId: null,
};

export default function celebrateCommentsReducer(
  state = initialState,
  action: AnyAction,
) {
  switch (action.type) {
    case REQUESTS.GET_CELEBRATE_COMMENTS.SUCCESS:
      return addCommentsToState(state, action);
    case REQUESTS.CREATE_CELEBRATE_COMMENT.SUCCESS:
      return addCreatedCommentToState(state, action);
    case REQUESTS.UPDATE_CELEBRATE_COMMENT.SUCCESS:
      return editCommentsInState(state, action);
    case REQUESTS.DELETE_CELEBRATE_COMMENT.SUCCESS:
      return removeCommentFromState(state, action);
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

function addCommentsToState(state: CelebrateCommentsState, action: AnyAction) {
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

function addCreatedCommentToState(
  state: CelebrateCommentsState,
  action: AnyAction,
) {
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

function removeCommentFromState(
  state: CelebrateCommentsState,
  action: AnyAction,
) {
  const {
    query: { eventId, commentId },
  } = action;

  const event = state.all[eventId];
  // This can happen when deleting a reported comment without loading the celebrate comments for that item
  if (!event) {
    return state;
  }
  const comments = event.comments.filter(
    (c: CelebrateComment) => c.id !== commentId,
  );

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

function editCommentsInState(state: CelebrateCommentsState, action: AnyAction) {
  const {
    results: { response },
    query: { eventId, commentId },
  } = action;

  const event = state.all[eventId];
  const comments = event.comments.map((c: CelebrateComment) =>
    c.id === commentId ? response : c,
  );

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
