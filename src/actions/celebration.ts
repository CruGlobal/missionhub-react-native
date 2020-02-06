import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { apolloClient } from '../apolloClient';
import { REQUESTS } from '../api/routes';
import { GET_CELEBRATE_FEED } from '../containers/CelebrateFeed/queries';

import callApi from './api';

export const getCelebrateFeed = (
  communityId: string,
  personId?: string,
  hasUnreadComments?: boolean,
) => {
  apolloClient.query({
    query: GET_CELEBRATE_FEED,
    variables: {
      communityId,
      personIds: personId,
      hasUnreadComments,
    },
  });
};

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
