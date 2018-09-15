import callApi, { REQUESTS } from './api';
import { getFeed, reloadFeed } from './challenges';

export function getGroupCelebrateFeed(orgId, personId = null) {
  return dispatch => {
    return dispatch(getFeed('celebrate', orgId, personId));
  };
}

export function reloadGroupCelebrateFeed(orgId) {
  return dispatch => {
    return dispatch(reloadFeed('celebrate', orgId));
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
