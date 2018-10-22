import { getFeed, reloadFeed, CELEBRATE } from '../utils/actions';

import callApi, { REQUESTS } from './api';

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
  const request = liked
    ? REQUESTS.UNLIKE_CELEBRATE_ITEM
    : REQUESTS.LIKE_CELEBRATE_ITEM;

  return async dispatch => {
    await dispatch(callApi(request, { orgId, eventId }));
    return dispatch(reloadGroupCelebrateFeed(orgId));
  };
}
