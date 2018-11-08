import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { addNewInteraction, editComment } from '../interactions';
import * as api from '../api';
import { REQUESTS } from '../api';
import * as analytics from '../analytics';
import * as impact from '../impact';
import { mockFnWithParams } from '../../../testUtils';
import { ACTIONS, INTERACTION_TYPES } from '../../constants';
import { reloadGroupCelebrateFeed } from '../celebration';
import { reloadJourney } from '../journey';

let store;

jest.mock('../celebration');
jest.mock('../journey');

const mockApi = (result, ...expectedParams) =>
  mockFnWithParams(api, 'default', result, ...expectedParams);

beforeEach(() =>
  (store = configureStore([thunk])({
    auth: {
      person: {
        id: '123',
      },
    },
    organizations: {
      all: [
        {
          id: orgId,
          celebratePagination: {
            page: 42,
            hasNextPage: false,
          },
        },
      ],
    },
  })));

const comment = 'new comment';
const personId = 1;
const orgId = 2;
const interaction = INTERACTION_TYPES.MHInteractionTypeGospelPresentation;
const trackActionResult = { type: 'tracked action' };
const refreshImpactResult = { type: 'refreshed impact' };
const celebrationFeedResult = { type: 'refreshed celebration feeed' };
const reloadJourneyResult = { type: 'reloaded journey' };

reloadJourney.mockReturnValue(reloadJourneyResult);

describe('add comment', () => {
  const addCommentResult = { type: 'added comment' };
  const action = dispatch => {
    dispatch(addCommentResult);
    return Promise.resolve();
  };

  beforeEach(() => {
    mockFnWithParams(
      analytics,
      'trackAction',
      trackActionResult,
      ACTIONS.INTERACTION.name,
      { [interaction.tracking]: null },
    );
    reloadGroupCelebrateFeed.mockReturnValue(celebrationFeedResult);
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

    it('should add a new comment', async () => {
      mockFnWithParams(impact, 'refreshImpact', refreshImpactResult, undefined);

      mockApi(action, REQUESTS.ADD_NEW_INTERACTION, {}, expectedBody);

      await store.dispatch(addNewInteraction(personId, interaction, comment));

      expect(store.getActions()).toEqual([
        addCommentResult,
        trackActionResult,
        reloadJourneyResult,
        refreshImpactResult,
        celebrationFeedResult,
      ]);
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

    it('should add a new comment', async () => {
      mockFnWithParams(impact, 'refreshImpact', refreshImpactResult, orgId);
      mockApi(action, REQUESTS.ADD_NEW_INTERACTION, {}, expectedBody);

      await store.dispatch(
        addNewInteraction(personId, interaction, comment, orgId),
      );
      expect(store.getActions()).toEqual([
        addCommentResult,
        trackActionResult,
        reloadJourneyResult,
        refreshImpactResult,
        celebrationFeedResult,
      ]);
    });

    it('should not add new comment, no personId', async () => {
      mockApi(action, REQUESTS.ADD_NEW_INTERACTION, {}, expectedBody);

      try {
        await store.dispatch(
          addNewInteraction(undefined, interaction, comment, orgId),
        );
      } catch (e) {
        expect(e).toBe(
          'Invalid Data from addNewInteraction: no personId passed in',
        );
      }
    });
  });
});

describe('edit comment', () => {
  const editCommentResult = { type: 'edited comment' };
  const action = dispatch => {
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
    mockFnWithParams(
      analytics,
      'trackActionWithoutData',
      trackActionResult,
      ACTIONS.JOURNEY_EDITED,
    );
  });

  it('should edit a comment', async () => {
    await store.dispatch(editComment({ id: interaction.id }, comment));

    expect(store.getActions()).toEqual([editCommentResult, trackActionResult]);
  });

  it('should not edit a comment, no interaction', async () => {
    try {
      await store.dispatch(editComment(undefined, comment));
    } catch (e) {
      expect(e).toBe(
        'Invalid Data from editComment: no interaction or no comment passed in',
      );
    }
  });

  it('should not edit a comment, no comment', async () => {
    try {
      await store.dispatch(editComment({ id: interaction.id }));
    } catch (e) {
      expect(e).toBe(
        'Invalid Data from editComment: no interaction or no comment passed in',
      );
    }
  });
});
