import { ThunkDispatch } from 'redux-thunk';

import {
  getFeed,
  reloadFeed,
  CELEBRATE,
  GET_CELEBRATE_INCLUDE,
} from '../utils/actions';
import { REQUESTS } from '../api/routes';

import callApi from './api';

export function getGroupCelebrateFeedUnread(orgId: string) {
  return (dispatch: ThunkDispatch<{}, {}, any>) =>
    dispatch(
      callApi(
        REQUESTS.GET_GROUP_CELEBRATE_FEED_UNREAD,
        {
          orgId,
        },
        {
          filters: { has_unread_comments: true },
          include: GET_CELEBRATE_INCLUDE,
        },
      ),
    );
}

export function getGroupCelebrateFeed(
  orgId: string,
  personId: string | null = null,
) {
  return (dispatch: ThunkDispatch<{}, {}, any>) =>
    dispatch(getFeed(CELEBRATE, orgId, personId));
}

export function reloadGroupCelebrateFeed(orgId: string) {
  return (dispatch: ThunkDispatch<{}, {}, any>) =>
    dispatch(reloadFeed(CELEBRATE, orgId));
}

export function toggleLike(orgId: string, eventId: string, liked: boolean) {
  const request = orgId
    ? liked
      ? REQUESTS.UNLIKE_CELEBRATE_ITEM
      : REQUESTS.LIKE_CELEBRATE_ITEM
    : liked
    ? REQUESTS.UNLIKE_GLOBAL_CELEBRATE_ITEM
    : REQUESTS.LIKE_GLOBAL_CELEBRATE_ITEM;

  return (dispatch: ThunkDispatch<{}, {}, any>) =>
    dispatch(callApi(request, { orgId, eventId }));
}
