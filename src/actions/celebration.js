import {
  DEFAULT_PAGE_LIMIT,
  RESET_CELEBRATION_PAGINATION,
  SET_CELEBRATION_FEED,
  SET_CELEBRATION_ITEM_LIKE,
} from '../constants';
import { celebrationSelector } from '../selectors/celebration';

import callApi, { REQUESTS } from './api';

export function getGroupCelebrateFeed(organization, personId = null) {
  return async (dispatch, getState) => {
    const { celebration } = getState();
    const celebrateFeed = celebrationSelector(
      { celebration },
      { organization },
    );

    const orgId = organization.id;
    console.log(celebrateFeed);
    const feedId = celebrateFeed.id ? celebrateFeed.id : celebration.ids.length;
    const { page, hasNextPage } = celebrateFeed.pagination
      ? celebrateFeed.pagination
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
      page,
      orgId,
      personId,
      feedId,
      newItems: response,
      meta,
    });
  };
}

export function reloadGroupCelebrateFeed(organization) {
  return (dispatch, getState) => {
    const { celebration } = getState();
    const celebrateFeed = celebrationSelector(
      { celebration },
      { organization },
    );

    if (celebrateFeed && celebrateFeed.pagination) {
      dispatch(resetPaginationAction(celebrateFeed.id));
      return dispatch(getGroupCelebrateFeed(organization));
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

export function toggleLike(organization, eventId, liked) {
  const request = liked
    ? REQUESTS.UNLIKE_CELEBRATE_ITEM
    : REQUESTS.LIKE_CELEBRATE_ITEM;

  return async (dispatch, getState) => {
    const { celebration } = getState();
    const feed = celebrationSelector({ celebration }, { organization });
    const query = { orgId: organization.id, eventId };

    await dispatch(callApi(request, query));
    dispatch({
      type: SET_CELEBRATION_ITEM_LIKE,
      eventId,
      feedId: feed.id,
      liked: !liked,
    });
    return dispatch(reloadGroupCelebrateFeed(organization));
  };
}
