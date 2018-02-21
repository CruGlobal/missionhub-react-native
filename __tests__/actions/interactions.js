import { addNewComment, editComment } from '../../src/actions/interactions';
import * as api from '../../src/actions/api';
import { REQUESTS } from '../../src/actions/api';
import * as analytics from '../../src/actions/analytics';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mockFnWithParams } from '../../testUtils';
import { ACTIONS, INTERACTION_TYPES } from '../../src/constants';

let store;

const mockApi = (result, ...expectedParams) => mockFnWithParams(api, 'default', result, ...expectedParams);

beforeEach(() => store = configureStore([ thunk ])({
  auth: { personId: '123' },
}));

const comment = 'new comment';
const personId = 1;
const orgId = 2;
const interactionId = 3;

describe('add comment', () => {
  const addCommentResult = { type: 'added comment' };
  const action = (dispatch) => {
    dispatch(addCommentResult);
    return Promise.resolve();
  };

  const trackActionResult = { type: 'tracked action' };

  const expectedQuery = {};
  const expectedBody = {
    data: {
      type: 'interaction',
      attributes: {
        interaction_type_id: INTERACTION_TYPES.MHInteractionTypeNote.id,
        comment: comment,
      },
      relationships: {
        receiver: {
          data: {
            type: 'person',
            id: personId,
          },
        },
        initiators: {
          data: [
            {
              type: 'person',
              id: '123',
            },
          ],
        },
      },
    },
    included: [],
  };

  beforeEach(() => {
    mockApi(action, REQUESTS.ADD_NEW_COMMENT, expectedQuery, expectedBody);
    mockFnWithParams(analytics, 'trackAction', trackActionResult, ACTIONS.COMMENT_ADDED);
  });

  it('should add a new comment', async() => {
    await store.dispatch(addNewComment(personId, comment));

    expect(store.getActions()).toEqual([ addCommentResult, trackActionResult ]);
  });
});

describe('add comment with org', () => {
  const addCommentResult = { type: 'added comment' };
  const action = (dispatch) => {
    dispatch(addCommentResult);
    return Promise.resolve();
  };
  const trackActionResult = { type: 'tracked action' };

  const expectedQuery = {};
  const expectedBody = {
    data: {
      type: 'interaction',
      attributes: {
        interaction_type_id: INTERACTION_TYPES.MHInteractionTypeNote.id,
        comment: comment,
      },
      relationships: {
        receiver: {
          data: {
            type: 'person',
            id: personId,
          },
        },
        initiators: {
          data: [
            {
              type: 'person',
              id: '123',
            },
          ],
        },
        organization: {
          data: {
            type: 'organization',
            id: orgId,
          },
        },
      },
    },
    included: [],
  };

  beforeEach(() => {
    mockApi(action, REQUESTS.ADD_NEW_COMMENT, expectedQuery, expectedBody);
    mockFnWithParams(analytics, 'trackAction', trackActionResult, ACTIONS.COMMENT_ADDED);
  });

  it('should add a new comment', async() => {
    await store.dispatch(addNewComment(personId, comment, orgId));

    expect(store.getActions()).toEqual([ addCommentResult, trackActionResult ]);
  });
});

describe('edit comment', () => {
  const action = { type: comment };

  const expectedQuery = {
    interactionId: interactionId,
  };
  const expectedBody = {
    data: {
      type: 'interaction',
      attributes: {
        comment: comment,
      },
    },
    included: [],
  };

  beforeEach(() => mockApi(action, REQUESTS.EDIT_COMMENT, expectedQuery, expectedBody));

  it('should edit a comment', () => {
    store.dispatch(editComment({ id: interactionId }, comment));

    expect(store.getActions()[0]).toBe(action);
  });
});
