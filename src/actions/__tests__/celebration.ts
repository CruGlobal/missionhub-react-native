/* eslint-disable  @typescript-eslint/no-explicit-any */

import configureStore, { MockStore } from 'redux-mock-store';
import thunk from 'redux-thunk';

import { GLOBAL_COMMUNITY_ID } from '../../constants';
import { apolloClient } from '../../apolloClient';
import { toggleLike, getCelebrateFeed } from '../celebration';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { GET_CELEBRATE_FEED } from '../../containers/CelebrateFeed/queries';

jest.mock('../api');

apolloClient.query = jest.fn();

const orgId = '123';
const personId = '333';

const apiResult = { type: 'done' };

const createStore = configureStore([thunk]);
let store: MockStore;

const currentPage = 0;

beforeEach(() => {
  (callApi as jest.Mock).mockReturnValue(apiResult);
});

describe('getCelebrateFeed', () => {
  it('should get group celebrate feed', () => {
    getCelebrateFeed(orgId);

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_CELEBRATE_FEED,
      variables: {
        communityId: orgId,
        personIds: undefined,
        hasUnreadComments: undefined,
      },
    });
  });

  it('should get member celebrate feed', () => {
    getCelebrateFeed(orgId, personId);

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_CELEBRATE_FEED,
      variables: {
        communityId: orgId,
        personIds: personId,
        hasUnreadComments: undefined,
      },
    });
  });

  it('should get unread comments feed', () => {
    getCelebrateFeed(orgId, undefined, true);

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_CELEBRATE_FEED,
      variables: {
        communityId: orgId,
        personIds: undefined,
        hasUnreadComments: true,
      },
    });
  });
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
    store.dispatch<any>(toggleLike(eventId, false, GLOBAL_COMMUNITY_ID));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.LIKE_GLOBAL_CELEBRATE_ITEM, {
      orgId: GLOBAL_COMMUNITY_ID,
      eventId,
    });
    expect(store.getActions()).toEqual([apiResult]);
  });

  it('toggles from like to unlike in global community', () => {
    store.dispatch<any>(toggleLike(eventId, true, GLOBAL_COMMUNITY_ID));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UNLIKE_GLOBAL_CELEBRATE_ITEM,
      {
        orgId: GLOBAL_COMMUNITY_ID,
        eventId,
      },
    );
    expect(store.getActions()).toEqual([apiResult]);
  });

  it('toggles from unlike to like in global community when orgId undefined', () => {
    store.dispatch<any>(toggleLike(eventId, false, undefined));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.LIKE_GLOBAL_CELEBRATE_ITEM, {
      orgId: undefined,
      eventId,
    });
    expect(store.getActions()).toEqual([apiResult]);
  });

  it('toggles from like to unlike in global community when orgId undefined', () => {
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
