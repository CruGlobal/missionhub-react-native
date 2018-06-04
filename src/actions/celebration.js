import callApi from '../actions/api';
import REQUESTS from '../api/routes';

export function getGroupCelebrateFeed(orgId) {
  return dispatch => {
    return dispatch(callApi(REQUESTS.GET_GROUP_CELEBRATE_FEED, { orgId }));
  };
}
