/* eslint-disable  @typescript-eslint/no-explicit-any */

import configureStore, { MockStore } from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  getGroupCelebrateFeed,
  toggleLike,
  getGroupCelebrateFeedUnread,
  reloadGroupCelebrateFeed,
} from '../celebration';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import {
  DEFAULT_PAGE_LIMIT,
  RESET_CELEBRATION_PAGINATION,
} from '../../constants';
import { GET_CELEBRATE_INCLUDE } from '../../utils/actions';

jest.mock('../api');

const orgId = '123';

const apiResult = { type: 'done' };

const createStore = configureStore([thunk]);
let store: MockStore;

const currentPage = 0;

describe('getGroupCelebrateFeed', () => {
  beforeEach(() => {
    store = createStore();
    (callApi as jest.Mock).mockReturnValue(apiResult);
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

    store.dispatch<any>(getGroupCelebrateFeed(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_GROUP_CELEBRATE_FEED, {
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * currentPage,
      },
      orgId,
      include:
        'subject_person.organizational_permissions,subject_person.contact_assignments',
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

    store.dispatch<any>(getGroupCelebrateFeed(orgId));

    expect(callApi).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });
});

describe('reloadGroupCelebrateFeed', () => {
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
    (callApi as jest.Mock).mockReturnValue(apiResult);
  });

  it('reloads feed', () => {
    store.dispatch<any>(reloadGroupCelebrateFeed(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_GROUP_CELEBRATE_FEED, {
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * currentPage,
      },
      orgId,
      include:
        'subject_person.organizational_permissions,subject_person.contact_assignments',
    });
    expect(store.getActions()).toEqual([
      { type: RESET_CELEBRATION_PAGINATION, orgId },
      apiResult,
    ]);
  });
});

describe('getGroupCelebrateFeedUnread', () => {
  beforeEach(() => {
    store = createStore({ organizations: { all: [{ id: orgId }] } });
  });

  it('calls feed of unread items', () => {
    store.dispatch<any>(getGroupCelebrateFeedUnread(orgId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_GROUP_CELEBRATE_FEED_UNREAD,
      {
        orgId,
        filters: { has_unread_comments: true },
        include: GET_CELEBRATE_INCLUDE,
      },
    );
    expect(store.getActions()).toEqual([apiResult]);
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
