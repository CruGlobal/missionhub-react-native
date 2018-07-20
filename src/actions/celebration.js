import { DEFAULT_PAGE_LIMIT, RESET_CELEBRATION_PAGINATION } from '../constants';

import callApi, { REQUESTS } from './api';

export function getGroupCelebrateFeed(orgId, personId = null) {
  return (dispatch, getState) => {
    const org = getState().organizations.all.find(o => {
      return o.id === orgId;
    });

    const { page, hasNextPage } = org.celebratePagination
      ? org.celebratePagination
      : { page: 0, hasNextPage: true };

    if (!hasNextPage) {
      return Promise.reject('NoMoreData');
    }
    const query = buildQuery(orgId, personId, page);
    dispatch(callApi(REQUESTS.GET_GROUP_CELEBRATE_FEED, query));
  };
}

export function reloadGroupCelebrateFeed(orgId) {
  return (dispatch, getState) => {
    const org = getState().organizations.all.find(o => {
      return o.id === orgId;
    });

    if (org && org.celebratePagination) {
      dispatch(resetPaginationAction(orgId));
      dispatch(getGroupCelebrateFeed(orgId));
    }
  };
}

const resetPaginationAction = orgId => {
  return {
    type: RESET_CELEBRATION_PAGINATION,
    orgId: orgId,
  };
};

function buildQuery(orgId, personId, page) {
  return {
    page: {
      limit: DEFAULT_PAGE_LIMIT,
      offset: DEFAULT_PAGE_LIMIT * page,
    },
    orgId,
    ...(personId ? { filters: { subject_person_ids: personId } } : {}),
  };
}
