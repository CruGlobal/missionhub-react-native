import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { addNewInteraction, editComment } from '../interactions';
import callApi, { REQUESTS } from '../api';
import { trackActionWithoutData, trackAction } from '../analytics';
import { refreshImpact } from '../impact';
import { ACTIONS, INTERACTION_TYPES } from '../../constants';
import { reloadGroupCelebrateFeed } from '../celebration';
import { reloadJourney } from '../journey';

let store;

jest.mock('../celebration');
jest.mock('../journey');
jest.mock('../api');
jest.mock('../impact');
jest.mock('../analytics');

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
    trackAction.mockReturnValue(trackActionResult);
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
      refreshImpact.mockReturnValue(refreshImpactResult);
      callApi.mockReturnValue(action);

      await store.dispatch(addNewInteraction(personId, interaction, comment));

      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.ADD_NEW_INTERACTION,
        {},
        expectedBody,
      );
      expect(trackAction).toHaveBeenCalledWith(ACTIONS.INTERACTION.name, {
        [interaction.tracking]: null,
      });
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
      refreshImpact.mockReturnValue(refreshImpactResult);
      callApi.mockReturnValue(action);

      await store.dispatch(
        addNewInteraction(personId, interaction, comment, orgId),
      );

      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.ADD_NEW_INTERACTION,
        {},
        expectedBody,
      );
      expect(trackAction).toHaveBeenCalledWith(ACTIONS.INTERACTION.name, {
        [interaction.tracking]: null,
      });
      expect(store.getActions()).toEqual([
        addCommentResult,
        trackActionResult,
        reloadJourneyResult,
        refreshImpactResult,
        celebrationFeedResult,
      ]);
    });

    it('should not add new comment, no personId', async () => {
      callApi.mockReturnValue(action);

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
    callApi.mockReturnValue(action);
    trackActionWithoutData.mockReturnValue(trackActionResult);
  });

  it('should edit a comment', async () => {
    await store.dispatch(editComment({ id: interaction.id }, comment));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.EDIT_COMMENT,
      expectedQuery,
      expectedBody,
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.JOURNEY_EDITED);
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
