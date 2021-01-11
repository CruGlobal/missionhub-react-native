import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { addNewInteraction, editComment } from '../interactions';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { getCelebrateFeed } from '../celebration';
import { trackActionWithoutData, trackAction } from '../analytics';
import { refreshImpact } from '../impact';
import { ACTIONS, INTERACTION_TYPES } from '../../constants';
import { reloadJourney } from '../journey';

// @ts-ignore
let store;

jest.mock('../celebration');
jest.mock('../journey');
jest.mock('../api');
jest.mock('../impact');
jest.mock('../analytics');
jest.mock('../../auth/authUtilities', () => ({
  getAuthPerson: () => ({
    id: '123',
  }),
}));

beforeEach(
  () =>
    (store = configureStore([thunk])({
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
    })),
);

const comment = 'new comment';
const personId = 1;
const orgId = 2;
const interaction = INTERACTION_TYPES.MHInteractionTypeNote;
const trackActionResult = { type: 'tracked action' };
const refreshImpactResult = { type: 'refreshed impact' };
const reloadJourneyResult = { type: 'reloaded journey' };

// @ts-ignore
reloadJourney.mockReturnValue(reloadJourneyResult);

describe('add comment', () => {
  const addCommentResult = { type: 'added comment' };
  // @ts-ignore
  const action = dispatch => {
    dispatch(addCommentResult);
    return Promise.resolve();
  };

  beforeEach(() => {
    // @ts-ignore
    trackAction.mockReturnValue(trackActionResult);
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
      // @ts-ignore
      refreshImpact.mockReturnValue(refreshImpactResult);
      // @ts-ignore
      callApi.mockReturnValue(action);

      // @ts-ignore
      await store.dispatch(addNewInteraction(personId, interaction, comment));

      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.ADD_NEW_INTERACTION,
        {},
        expectedBody,
      );
      expect(trackAction).toHaveBeenCalledWith(ACTIONS.INTERACTION.name, {
        [interaction.tracking]: null,
      });
      // @ts-ignore
      expect(store.getActions()).toEqual([
        addCommentResult,
        trackActionResult,
        reloadJourneyResult,
        refreshImpactResult,
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
      // @ts-ignore
      refreshImpact.mockReturnValue(refreshImpactResult);
      // @ts-ignore
      callApi.mockReturnValue(action);

      // @ts-ignore
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
      expect(getCelebrateFeed).toHaveBeenCalledWith(orgId);
      // @ts-ignore
      expect(store.getActions()).toEqual([
        addCommentResult,
        trackActionResult,
        reloadJourneyResult,
        refreshImpactResult,
      ]);
    });

    it('should not add new comment, no personId', async () => {
      // @ts-ignore
      callApi.mockReturnValue(action);

      await expect(
        // @ts-ignore
        store.dispatch(
          addNewInteraction(undefined, interaction, comment, orgId),
        ),
      ).rejects.toEqual(
        'Invalid Data from addNewInteraction: no personId passed in',
      );
    });
  });
});

describe('edit comment', () => {
  const editCommentResult = { type: 'edited comment' };
  // @ts-ignore
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
    // @ts-ignore
    callApi.mockReturnValue(action);
    // @ts-ignore
    trackActionWithoutData.mockReturnValue(trackActionResult);
  });

  it('should edit a comment', async () => {
    // @ts-ignore
    await store.dispatch(editComment(interaction.id, comment));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.EDIT_COMMENT,
      expectedQuery,
      expectedBody,
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.JOURNEY_EDITED);
    // @ts-ignore
    expect(store.getActions()).toEqual([editCommentResult, trackActionResult]);
  });

  it('should not edit a comment, no interaction', async () => {
    await expect(
      // @ts-ignore
      store.dispatch(editComment(undefined, comment)),
    ).rejects.toEqual(
      'Invalid Data from editComment: no interaction or no comment passed in',
    );
  });

  it('should not edit a comment, no comment', async () => {
    await expect(
      // @ts-ignore
      store.dispatch(editComment(interaction.id)),
    ).rejects.toEqual(
      'Invalid Data from editComment: no interaction or no comment passed in',
    );
  });
});
