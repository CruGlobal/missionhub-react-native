import {
  DEFAULT_PAGE_LIMIT,
  RESET_CELEBRATION_PAGINATION,
  SET_CELEBRATION_FEED,
} from '../constants';

import callApi, { REQUESTS } from './api';

export function getGroupCelebrateFeed(orgId, personId = null) {
  return async dispatch => {
    const feed = celebrateSelector();

    const { page, hasNextPage } = feed.pagination
      ? feed.pagination
      : { page: 0, hasNextPage: true };

    if (!hasNextPage) {
      // Does not have more data
      return Promise.resolve();
    }
    const query = buildQuery(orgId, personId, page);
    const { response } = await dispatch(
      callApi(REQUESTS.GET_GROUP_CELEBRATE_FEED, query),
    );

    return dispatch({
      query,
      orgId,
      personId,
      feedId: feed.id,
      newItems: response,
    });
  };
}

export function reloadGroupCelebrateFeed(orgId) {
  return dispatch => {
    const feed = celebrateSelector();

    if (feed && feed.pagination) {
      dispatch(resetPaginationAction(orgId));
      return dispatch(getGroupCelebrateFeed(orgId));
    }
    return Promise.resolve();
  };
}

const resetPaginationAction = orgId => {
  return {
    type: RESET_CELEBRATION_PAGINATION,
    orgId,
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

export function toggleLike(orgId, eventId, liked) {
  const request = liked
    ? REQUESTS.UNLIKE_CELEBRATE_ITEM
    : REQUESTS.LIKE_CELEBRATE_ITEM;

  return async dispatch => {
    await dispatch(callApi(request, { orgId, eventId }));
    return dispatch(reloadGroupCelebrateFeed(orgId));
  };
}
