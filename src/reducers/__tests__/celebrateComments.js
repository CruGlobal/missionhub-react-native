import { REQUESTS } from '../../actions/api';
import celebrateCommentsReducer from '../celebrateComments';

beforeEach(() => jest.clearAllMocks());

describe('REQUESTS.GET_CELEBRATE_COMMENTS.SUCCESS', () => {
  it('should add object to initial state', () => {
    const eventId = '13407923';
    const response = [{ id: 'comment one' }, { id: 'comment two' }];

    expect(
      celebrateCommentsReducer(undefined, {
        type: REQUESTS.GET_CELEBRATE_COMMENTS.SUCCESS,
        results: { response },
        query: { eventId },
      }),
    ).toEqual({
      all: {
        [eventId]: { comments: response, pagination: expect.anything() },
      },
    });
  });
});
