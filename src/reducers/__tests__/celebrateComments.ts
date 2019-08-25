import { REQUESTS } from '../../api/routes';
import celebrateCommentsReducer from '../celebrateComments';
import { getPagination } from '../../utils/common';
import {
  SET_CELEBRATE_EDITING_COMMENT,
  RESET_CELEBRATE_EDITING_COMMENT,
} from '../../constants';

jest.mock('../../utils/common');

const editingCommentId = null;
const getPaginationResult = { page: 4 };
const pagination = getPaginationResult;
(getPagination as jest.Mock).mockReturnValue(getPaginationResult);

describe('REQUESTS.GET_CELEBRATE_COMMENTS.SUCCESS', () => {
  const eventId = '13407923';
  const response = [{ id: 'comment one' }, { id: 'comment two' }];

  const baseAction = {
    type: REQUESTS.GET_CELEBRATE_COMMENTS.SUCCESS,
    results: { response },
    query: { eventId },
  };

  describe('initial state', () => {
    it('should add object to initial state', () => {
      expect(celebrateCommentsReducer(undefined, baseAction)).toEqual({
        all: {
          [eventId]: expect.objectContaining({ comments: response }),
        },
        editingCommentId,
      });
    });
  });
});

describe('state has existing comments', () => {
  const eventId = '13407923';
  const response = [{ id: 'comment one' }, { id: 'comment two' }];

  const baseAction = {
    type: REQUESTS.GET_CELEBRATE_COMMENTS.SUCCESS,
    results: { response },
    query: { eventId },
  };

  const existingComments = [{ id: 'comment three' }, { id: 'comment four' }];
  const stateWithExistingComments = {
    all: {
      [eventId]: { comments: existingComments },
    },
    editingCommentId,
  };

  it('should add objects from next page', () => {
    expect(
      celebrateCommentsReducer(stateWithExistingComments, {
        ...baseAction,
        query: { ...baseAction.query, page: {} },
      }),
    ).toEqual({
      all: {
        [eventId]: {
          comments: [...existingComments, ...response],
          pagination,
        },
      },
      editingCommentId,
    });
  });

  it('should reset comments if there is no page', () => {
    expect(
      celebrateCommentsReducer(stateWithExistingComments, baseAction),
    ).toEqual({
      all: {
        [eventId]: expect.objectContaining({ comments: response }),
      },
      editingCommentId,
    });
  });
  it('should update pagination data', () => {
    expect(celebrateCommentsReducer(undefined, baseAction)).toEqual({
      all: {
        [eventId]: expect.objectContaining({ pagination: getPaginationResult }),
      },
      editingCommentId,
    });
    expect(getPagination).toHaveBeenCalledWith(baseAction, response.length);
  });
});

describe('REQUESTS.GET_CELEBRATE_COMMENTS.SUCCESS', () => {
  const eventId = '13407923';
  const response = { id: 'comment six' };
  const existingComment = { id: 'comment five' };
  const stateWithExistingComments = {
    all: {
      [eventId]: { comments: [existingComment] },
    },
    editingCommentId: null,
  };

  const action = {
    type: REQUESTS.CREATE_CELEBRATE_COMMENT.SUCCESS,
    results: { response },
    query: { eventId },
  };

  it('should add created item to the list', () => {
    expect(celebrateCommentsReducer(stateWithExistingComments, action)).toEqual(
      {
        all: {
          [eventId]: expect.objectContaining({
            comments: [existingComment, response],
          }),
        },
      },
    );
  });
});

describe('REQUESTS.DELETE_CELEBRATE_COMMENTS.SUCCESS', () => {
  const eventId = '13407923';
  const commentId = 'comment five';
  const existingComment1 = { id: commentId };
  const existingComment2 = { id: 'comment six' };
  const stateWithExistingComments = {
    all: {
      [eventId]: { comments: [existingComment1, existingComment2] },
    },
    editingCommentId: null,
  };

  const action = {
    type: REQUESTS.DELETE_CELEBRATE_COMMENT.SUCCESS,
    query: { eventId, commentId },
  };

  it('should remove item from the list', () => {
    expect(celebrateCommentsReducer(stateWithExistingComments, action)).toEqual(
      {
        all: {
          [eventId]: expect.objectContaining({
            comments: [existingComment2],
          }),
        },
      },
    );
  });
});

describe('REQUESTS.UPDATE_CELEBRATE_COMMENTS.SUCCESS', () => {
  const eventId = '13407923';
  const commentId = 'comment five';
  const existingComment1 = { id: commentId, content: 'text 1' };
  const existingComment2 = { id: 'comment six', content: 'text 2' };
  const stateWithExistingComments = {
    all: {
      [eventId]: { comments: [existingComment1, existingComment2] },
    },
    editingCommentId: null,
  };

  const updated = 'text 1 updated';
  const response = { id: commentId, content: updated };
  const action = {
    type: REQUESTS.UPDATE_CELEBRATE_COMMENT.SUCCESS,
    results: { response },
    query: { eventId, commentId },
  };

  it('should update item in the list', () => {
    expect(celebrateCommentsReducer(stateWithExistingComments, action)).toEqual(
      {
        all: {
          [eventId]: expect.objectContaining({
            comments: [
              { ...existingComment1, content: updated },
              existingComment2,
            ],
          }),
        },
      },
    );
  });
});

it('sets editing comment', () => {
  const comment = { id: 'test' };
  const state = celebrateCommentsReducer(undefined, {
    type: SET_CELEBRATE_EDITING_COMMENT,
    commentId: comment.id,
  });
  expect(state.editingCommentId).toEqual(comment.id);
});

it('resets editing comment', () => {
  const state = celebrateCommentsReducer(undefined, {
    type: RESET_CELEBRATE_EDITING_COMMENT,
  });
  expect(state.editingCommentId).toEqual(null);
});
