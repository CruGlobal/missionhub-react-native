import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  getGroupCelebrateFeed,
  toggleLike,
} from '../../src/actions/celebration';
import callApi, { REQUESTS } from '../../src/actions/api';
import {
  DEFAULT_PAGE_LIMIT,
  RESET_CELEBRATION_PAGINATION,
} from '../../src/constants';

jest.mock('../../src/actions/api');

const orgId = '123';

const apiResult = { type: 'done' };

const createStore = configureStore([thunk]);
let store;

const currentPage = 0;

beforeEach(() => {
  callApi.mockClear();
});

describe('getGroupCelebrateFeed', () => {
  beforeEach(() => {
    store = createStore();
  });

  it('gets a page of celebrate feed', () => {
    store = createStore({
      organizations: {
        all: [
          {
            id: orgId,
            celebratePagination: {
              hasNextPage: true,
              page: currentPage,
            },
          },
        ],
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
        all: [
          {
            id: orgId,
            celebratePagination: {
              hasNextPage: false,
              page: currentPage,
            },
          },
        ],
      },
    });

    callApi.mockReturnValue(apiResult);

    store.dispatch(getGroupCelebrateFeed(orgId));

    expect(callApi).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });
});

describe('toggleLike', () => {
  const eventId = '456';
  const liked = false;
  const resetResult = { type: RESET_CELEBRATION_PAGINATION, orgId };

  it('toggles from unlike to like', async () => {
    store = createStore({
      organizations: {
        all: [
          {
            id: orgId,
            celebratePagination: {
              hasNextPage: true,
              page: currentPage,
            },
          },
        ],
      },
    });

    callApi.mockReturnValue(apiResult);

    await store.dispatch(toggleLike(orgId, eventId, liked));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.LIKE_CELEBRATE_ITEM, {
      orgId,
      eventId,
    });
    expect(store.getActions()).toEqual([apiResult, resetResult, apiResult]);
  });
});
