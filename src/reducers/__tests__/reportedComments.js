import { REQUESTS } from '../../actions/api';
import reportedCommentsReducer from '../reportedComments';

beforeEach(() => jest.clearAllMocks());

describe('REQUESTS.GET_REPORTED_COMMENTS.SUCCESS', () => {
  const orgId = '13407923';
  const response = [{ id: 'reportOne' }, { id: 'reportTwo' }];

  const baseAction = {
    type: REQUESTS.GET_REPORTED_COMMENTS.SUCCESS,
    results: { response },
    query: { orgId },
  };

  describe('set comments', () => {
    it('should add comments to initial state', () => {
      expect(reportedCommentsReducer(undefined, baseAction)).toEqual({
        all: {
          [orgId]: response,
        },
      });
    });
  });
});
