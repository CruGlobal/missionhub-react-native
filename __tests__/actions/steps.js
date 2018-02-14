import * as api from '../../src/actions/api';
import { REQUESTS } from '../../src/actions/api';
import { challengeCompleteAction } from '../../src/actions/steps';
import { mockFnWithParams, createMockStore } from '../../testUtils';
import * as common from '../../src/utils/common';

let store;

const mockStep = {
  id: 1,
  receiver: {
    id: 10,
  },
};

const mockApi = (result, ...expectedParams) => mockFnWithParams(api, 'default', result, ...expectedParams);
const mockApiReturnValue = (result) => {
  return (dispatch) => {
    return dispatch(() => Promise.resolve(result));
  };
};

const mockDate = '2018-02-14 11:30:00 UTC';
common.formatApiDate = jest.fn().mockReturnValue(mockDate);

describe('actions called', () => {
  beforeEach(() => store = createMockStore({
    auth: {
      personId: '10',
    },
    steps: {
      userStepCount: {
        [10]: 1,
      },
    },
  }));

  const query = { challenge_id: 1 };
  const data = {
    data: {
      type: 'accepted_challenge',
      attributes: {
        completed_at: mockDate,
      },
    },
  };

  mockApi(mockApiReturnValue({ findAll: () => [] }), REQUESTS.CHALLENGE_COMPLETE, query, data);
  

  it('should call challengeCompleteAction', () => {
    store.dispatch(challengeCompleteAction(mockStep));

    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });
});
