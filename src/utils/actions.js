import {
  DEFAULT_PAGE_LIMIT,
  RESET_CHALLENGE_PAGINATION,
  RESET_CELEBRATION_PAGINATION,
  GLOBAL_COMMUNITY_ID,
} from '../constants';
import callApi, { REQUESTS } from '../actions/api';
import { organizationSelector } from '../selectors/organizations';

// Challenge and Celebrate action helpers

export const CHALLENGE = 'challenge';
export const CELEBRATE = 'celebrate';

const getOrg = (orgId, getState) =>
  organizationSelector(
    { organizations: getState().organizations },
    { orgId: orgId },
  );

const getFeedType = (type, orgId) =>
  type === CHALLENGE
    ? REQUESTS.GET_GROUP_CHALLENGE_FEED
    : orgId === GLOBAL_COMMUNITY_ID
      ? REQUESTS.GET_GLOBAL_CELEBRATE_FEED
      : REQUESTS.GET_GROUP_CELEBRATE_FEED;

const getPaginationType = type =>
  type === CHALLENGE ? 'challengePagination' : 'celebratePagination';

// Query for the celebrate and challenge feeds
function buildQuery(type, orgId, page, personId) {
  return {
    page: {
      limit: DEFAULT_PAGE_LIMIT,
      offset: DEFAULT_PAGE_LIMIT * page,
    },
    ...(type === CELEBRATE ? { orgId } : {}),
    ...(type === CELEBRATE && personId
      ? { filters: { subject_person_ids: personId } }
      : {}),
    ...(type === CHALLENGE
      ? { filters: { organization_ids: orgId }, sort: '-active,-created_at' }
      : {}),
  };
}

const resetPaginationAction = (type, orgId) => ({
  type:
    type === CHALLENGE
      ? RESET_CHALLENGE_PAGINATION
      : RESET_CELEBRATION_PAGINATION,
  orgId,
});

// Use this for the challenge and celebrate feeds
export function getFeed(type, orgId, personId = null) {
  return (dispatch, getState) => {
    const org = getOrg(orgId, getState);
    const pagingType = getPaginationType(type);
    const { page, hasNextPage } = org[pagingType]
      ? org[pagingType]
      : { page: 0, hasNextPage: true };

    if (!hasNextPage) {
      // Does not have more data
      return Promise.resolve();
    }
    const query = buildQuery(type, orgId, page, personId);

    return dispatch(callApi(getFeedType(type, orgId), query));
  };
}

// Use this for reloading the challenge and celebrate feeds
export function reloadFeed(type, orgId) {
  return (dispatch, getState) => {
    const org = getOrg(orgId, getState);
    const pagingType = getPaginationType(type);

    if (org && org[pagingType]) {
      dispatch(resetPaginationAction(type, orgId));
      return dispatch(getFeed(type, orgId));
    }
    return Promise.resolve();
  };
}
