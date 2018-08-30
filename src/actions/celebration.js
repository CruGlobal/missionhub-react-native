import {
  DEFAULT_PAGE_LIMIT,
  RESET_CELEBRATION_PAGINATION,
  SET_CELEBRATION_FEED,
  SET_CELEBRATION_ITEM_LIKE,
} from '../constants';
import { celebrationSelector } from '../selectors/celebration';

import callApi, { REQUESTS } from './api';

export function getGroupCelebrateFeed(orgId, personId = null) {
  return async (dispatch, getState) => {
    const { organizations, celebration } = getState();
    const feed = celebrationSelector({ organizations, celebration }, { orgId });

    if (!feed.id) {
      feed.id = celebration.ids.length;
    }

    const { page, hasNextPage } = feed.pagination
      ? feed.pagination
      : { page: 0, hasNextPage: true };

    if (!hasNextPage) {
      // Does not have more data
      return Promise.resolve();
    }
    const query = buildQuery(orgId, personId, page);
    const { response, meta } = await dispatch(
      callApi(REQUESTS.GET_GROUP_CELEBRATE_FEED, query),
    );

    return dispatch({
      type: SET_CELEBRATION_FEED,
      query,
      orgId,
      personId,
      feedId: feed.id,
      newItems: response,
      meta,
    });
  };
}

export function reloadGroupCelebrateFeed(orgId) {
  return (dispatch, getState) => {
    const { organizations, celebration } = getState();
    const feed = celebrationSelector({ organizations, celebration }, { orgId });

    if (feed && feed.pagination) {
      dispatch(resetPaginationAction(feed.id));
      return dispatch(getGroupCelebrateFeed(orgId));
    }
    return Promise.resolve();
  };
}

const resetPaginationAction = feedId => {
  return {
    type: RESET_CELEBRATION_PAGINATION,
    feedId,
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

  return async (dispatch, getState) => {
    const { organizations, celebration } = getState();
    const feed = celebrationSelector({ organizations, celebration }, { orgId });
    const query = { orgId, eventId };

    await dispatch(callApi(request, query));
    dispatch({
      type: SET_CELEBRATION_ITEM_LIKE,
      query,
      eventId,
      feedId: feed.id,
      liked: !liked,
    });
    return dispatch(reloadGroupCelebrateFeed(orgId));
  };
}
