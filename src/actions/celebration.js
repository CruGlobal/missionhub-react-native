import { DEFAULT_PAGE_LIMIT } from '../constants';

import callApi, { REQUESTS } from './api';

export function getGroupCelebrateFeed(orgId, personId = null) {
  return (dispatch, getState) => {
    const { page, hasNextPage } = getState().organizations.celebratePagination;
    if (!hasNextPage) {
      return Promise.reject('NoMoreData');
    }
    const query = buildQuery(orgId, personId, page);

    dispatch(callApi(REQUESTS.GET_GROUP_CELEBRATE_FEED, query));
  };
}

function buildQuery(orgId, personId, page) {
  let query = {
    page: {
      limit: DEFAULT_PAGE_LIMIT,
      offset: DEFAULT_PAGE_LIMIT * page,
    },
    orgId,
  };

  if (personId) {
    query = {
      ...query,
      person_id: personId,
    };
  }

  return query;
}
