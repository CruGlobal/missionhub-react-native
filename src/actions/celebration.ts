import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { REQUESTS } from '../api/routes';

import callApi from './api';

export function toggleLike(eventId: string, liked: boolean, orgId?: string) {
  const request = orgId
    ? liked
      ? REQUESTS.UNLIKE_CELEBRATE_ITEM
      : REQUESTS.LIKE_CELEBRATE_ITEM
    : liked
    ? REQUESTS.UNLIKE_GLOBAL_CELEBRATE_ITEM
    : REQUESTS.LIKE_GLOBAL_CELEBRATE_ITEM;

  return (dispatch: ThunkDispatch<{}, null, AnyAction>) =>
    dispatch(callApi(request, { orgId, eventId }));
}
