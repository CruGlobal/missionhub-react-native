import { addNewInteraction, editComment } from '../../src/actions/interactions';
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
const interaction = INTERACTION_TYPES.MHInteractionTypeGospelPresentation;
const trackActionResult = { type: 'tracked action' };

describe('add comment', () => {
  const addCommentResult = { type: 'added comment' };
  const action = (dispatch) => {
    dispatch(addCommentResult);
    return Promise.resolve();
  };

  beforeEach(() => {
    mockFnWithParams(analytics, 'trackAction', trackActionResult, interaction.tracking);
  });

  describe('without org', () => {
    const expectedBody = {
      data: {
        type: 'interaction',
        attributes: {
          interaction_type_id: interaction.id,
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

    it('should add a new comment', async() => {
      mockApi(action, REQUESTS.ADD_NEW_INTERACTION, {}, expectedBody);

      await store.dispatch(addNewInteraction(personId, interaction, comment));

      expect(store.getActions()).toEqual([ addCommentResult, trackActionResult ]);
    });
  });

  describe('with org', () => {
    const expectedBody = {
      data: {
        type: 'interaction',
        attributes: {
          interaction_type_id: interaction.id,
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

    it('should add a new comment', async() => {
      mockApi(action, REQUESTS.ADD_NEW_INTERACTION, {}, expectedBody);

      await store.dispatch(addNewInteraction(personId, interaction, comment, orgId));
      expect(store.getActions()).toEqual([ addCommentResult, trackActionResult ]);
    });
  });
});

describe('edit comment', () => {
  const editCommentResult = { type: 'edited comment' };
  const action = (dispatch) => {
    dispatch(editCommentResult);
    return Promise.resolve();
  };

  const expectedQuery = {
    interactionId: interaction.id,
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

  beforeEach(() => {
    mockApi(action, REQUESTS.EDIT_COMMENT, expectedQuery, expectedBody);
    mockFnWithParams(analytics, 'trackAction', trackActionResult, ACTIONS.JOURNEY_EDITED);
  });

  it('should edit a comment', async() => {
    await store.dispatch(editComment({ id: interaction.id }, comment));

    expect(store.getActions()).toEqual([ editCommentResult, trackActionResult ]);
  });
});
