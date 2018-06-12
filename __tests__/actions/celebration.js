import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  getGroupCelebrateFeed,
  getGroupCelebrateNextPage,
} from '../../src/actions/celebration';
import callApi, { REQUESTS } from '../../src/actions/api';
import { DEFAULT_PAGE_LIMIT } from '../../src/constants';

jest.mock('../../src/actions/api');

const orgId = '123';

apiResult = { type: 'done' };

const createStore = configureStore([thunk]);
let store;

beforeEach(() => {
  callApi.mockClear();
});

describe('getGroupCelebrateFeed', () => {
  beforeEach(() => {
    store = createStore();
  });

  it('gets celebrate feed with no extra parameters', () => {
    callApi.mockReturnValue(apiResult);

    store.dispatch(getGroupCelebrateFeed(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_GROUP_CELEBRATE_FEED, {
      orgId,
    });
    expect(store.getActions()).toEqual([apiResult]);
  });

  it('gets celebrate feed with filters', () => {
    callApi.mockReturnValue(apiResult);
    const extraQuery = { page: { limit: 25 } };

    store.dispatch(getGroupCelebrateFeed(orgId, extraQuery));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_GROUP_CELEBRATE_FEED, {
      ...extraQuery,
      orgId,
    });
    expect(store.getActions()).toEqual([apiResult]);
  });
});

describe('getGroupCelebrateNextPage', () => {
  const currentPage = 1;

  it('gets next page of celebrate feed', () => {
    store = createStore({
      organizations: {
        celebratePagination: {
          hasNextPage: true,
          page: currentPage,
        },
      },
    });

    callApi.mockReturnValue(apiResult);

    store.dispatch(getGroupCelebrateNextPage(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_GROUP_CELEBRATE_FEED, {
      include: '',
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * currentPage,
      },
      orgId,
    });
    expect(store.getActions()).toEqual([apiResult]);
  });
});
