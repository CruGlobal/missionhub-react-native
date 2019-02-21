import { REQUESTS } from '../../actions/api';
import celebrateCommentsReducer from '../celebrateComments';
import { getPagination } from '../../utils/common';

jest.mock('../../utils/common');

beforeEach(() => jest.clearAllMocks());

const getPaginationResult = { page: 4 };
getPagination.mockReturnValue(getPaginationResult);

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
          [eventId]: { comments: response, pagination: expect.anything() },
        },
      });
    });
  });

  describe('state has existing comments', () => {
    const existingComments = [{ id: 'comment three' }, { id: 'comment four' }];

    it('should add objects from next page', () => {
      expect(
        celebrateCommentsReducer(
          {
            all: {
              [eventId]: { comments: existingComments },
            },
          },
          {
            ...baseAction,
            query: { ...baseAction.query, page: {} },
          },
        ),
      ).toEqual({
        all: {
          [eventId]: {
            comments: [...existingComments, ...response],
            pagination: expect.anything(),
          },
        },
      });
    });

    it('should reset comments if there is no page', () => {
      expect(
        celebrateCommentsReducer(
          {
            all: {
              [eventId]: { comments: existingComments },
            },
          },
          baseAction,
        ),
      ).toEqual({
        all: {
          [eventId]: {
            comments: response,
            pagination: expect.anything(),
          },
        },
      });
    });
  });

  it('should update pagination data', () => {
    expect(celebrateCommentsReducer(undefined, baseAction)).toEqual({
      all: {
        [eventId]: {
          comments: expect.anything(),
          pagination: getPaginationResult,
        },
      },
    });
    expect(getPagination).toHaveBeenCalledWith(baseAction, response.length);
  });
});
