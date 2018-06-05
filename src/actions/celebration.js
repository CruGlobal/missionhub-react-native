import callApi, { REQUESTS } from './api';

export function getGroupCelebrateFeed(orgId) {
  return dispatch =>
    dispatch(callApi(REQUESTS.GET_GROUP_CELEBRATE_FEED, { orgId }));
}
