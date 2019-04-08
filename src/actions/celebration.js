import {
  getFeed,
  reloadFeed,
  CELEBRATE,
  GET_CELEBRATE_INCLUDE,
} from '../utils/actions';

import callApi, { REQUESTS } from './api';

export function getGroupCelebrateFeedUnread(orgId) {
  return dispatch => {
    const query = {
      orgId,
      filters: { has_unread_comments: true },
      include: GET_CELEBRATE_INCLUDE,
    };
    return dispatch(callApi(REQUESTS.GET_GROUP_CELEBRATE_FEED_UNREAD, query));
  };
}

export function getGroupCelebrateFeed(orgId, personId = null) {
  return dispatch => {
    return dispatch(getFeed(CELEBRATE, orgId, personId));
  };
}

export function reloadGroupCelebrateFeed(orgId) {
  return dispatch => {
    return dispatch(reloadFeed(CELEBRATE, orgId));
  };
}

export function toggleLike(orgId, eventId, liked) {
  const request = orgId
    ? liked
      ? REQUESTS.UNLIKE_CELEBRATE_ITEM
      : REQUESTS.LIKE_CELEBRATE_ITEM
    : liked
    ? REQUESTS.UNLIKE_GLOBAL_CELEBRATE_ITEM
    : REQUESTS.LIKE_GLOBAL_CELEBRATE_ITEM;

  return dispatch => {
    return dispatch(callApi(request, { orgId, eventId }));
  };
}
