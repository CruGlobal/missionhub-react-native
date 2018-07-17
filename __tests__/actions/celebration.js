import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { getGroupCelebrateFeed } from '../../src/actions/celebration';
import callApi, { REQUESTS } from '../../src/actions/api';
import { DEFAULT_PAGE_LIMIT } from '../../src/constants';

jest.mock('../../src/actions/api');

const orgId = '123';

const apiResult = { type: 'done' };

const createStore = configureStore([thunk]);
let store;

beforeEach(() => {
  callApi.mockClear();
});

describe('getGroupCelebrateFeed', () => {
  beforeEach(() => {
    store = createStore();
  });

  const currentPage = 0;

  it('gets a page of celebrate feed', () => {
    store = createStore({
      organizations: {
        celebratePagination: {
          hasNextPage: true,
          page: currentPage,
        },
      },
    });

    callApi.mockReturnValue(apiResult);

    store.dispatch(getGroupCelebrateFeed(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_GROUP_CELEBRATE_FEED, {
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * currentPage,
      },
      orgId,
    });
    expect(store.getActions()).toEqual([apiResult]);
  });

  it('does not get celebrate items if there is no next page', () => {
    store = createStore({
      organizations: {
        celebratePagination: {
          hasNextPage: false,
          page: currentPage,
        },
      },
    });

    callApi.mockReturnValue(apiResult);

    store.dispatch(getGroupCelebrateFeed(orgId));

    expect(callApi).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });
});
