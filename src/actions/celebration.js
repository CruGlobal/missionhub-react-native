import { DEFAULT_PAGE_LIMIT } from '../constants';

import callApi, { REQUESTS } from './api';

export function getGroupCelebrateFeed(orgId) {
  return (dispatch, getState) => {
    const { page, hasNextPage } = getState().organizations.celebratePagination;
    if (!hasNextPage) {
      return Promise.reject('NoMoreData');
    }
    const queryObj = {
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * page,
      },
      orgId,
    };

    dispatch(callApi(REQUESTS.GET_GROUP_CELEBRATE_FEED, queryObj));
  };
}

export function getGroupCelebrateNextPage(orgId) {
  return (dispatch, getState) => {
    const { page, hasNextPage } = getState().organizations.celebratePagination;
    if (!hasNextPage) {
      return Promise.reject('NoMoreData');
    }
    const query = {
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * page,
      },
      include: '',
    };

    return dispatch(getGroupCelebrateFeed(orgId, query));
  };
}
