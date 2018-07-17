import { DEFAULT_PAGE_LIMIT } from '../constants';

import callApi, { REQUESTS } from './api';

export function getGroupCelebrateFeed(orgId, personId = null) {
  return (dispatch, getState) => {
    const org = getState().organizations.all.filter(o => {
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
