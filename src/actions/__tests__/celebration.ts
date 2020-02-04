/* eslint-disable  @typescript-eslint/no-explicit-any */

import configureStore, { MockStore } from 'redux-mock-store';
import thunk from 'redux-thunk';

import { toggleLike } from '../celebration';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';

jest.mock('../api');

const orgId = '123';

const apiResult = { type: 'done' };

const createStore = configureStore([thunk]);
let store: MockStore;

const currentPage = 0;

beforeEach(() => {
  (callApi as jest.Mock).mockReturnValue(apiResult);
});

describe('toggleLike', () => {
  const eventId = '456';
  beforeEach(() => {
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
  });

  it('toggles from unlike to like', () => {
    store.dispatch<any>(toggleLike(eventId, false, orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.LIKE_CELEBRATE_ITEM, {
      orgId,
      eventId,
    });
    expect(store.getActions()).toEqual([apiResult]);
  });

  it('toggles from like to unlike', () => {
    store.dispatch<any>(toggleLike(eventId, true, orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.UNLIKE_CELEBRATE_ITEM, {
      orgId,
      eventId,
    });
    expect(store.getActions()).toEqual([apiResult]);
  });

  it('toggles from unlike to like in global community', () => {
    store.dispatch<any>(toggleLike(eventId, false, undefined));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.LIKE_GLOBAL_CELEBRATE_ITEM, {
      orgId: undefined,
      eventId,
    });
    expect(store.getActions()).toEqual([apiResult]);
  });

  it('toggles from like to unlike in global community', () => {
    store.dispatch<any>(toggleLike(eventId, true, undefined));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UNLIKE_GLOBAL_CELEBRATE_ITEM,
      {
        orgId: undefined,
        eventId,
      },
    );
    expect(store.getActions()).toEqual([apiResult]);
  });
});
