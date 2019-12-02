/* eslint max-params: 0 */
import { ThunkDispatch } from 'redux-thunk';

import {
  DEFAULT_PAGE_LIMIT,
  RESET_CHALLENGE_PAGINATION,
  RESET_CELEBRATION_PAGINATION,
  GLOBAL_COMMUNITY_ID,
} from '../constants';
import callApi from '../actions/api';
import { REQUESTS } from '../api/routes';
import { organizationSelector } from '../selectors/organizations';
import { OrganizationsState } from '../reducers/organizations';

// Challenge and Celebrate action helpers

export const GET_CELEBRATE_INCLUDE =
  'subject_person.organizational_permissions,subject_person.contact_assignments';

export const CHALLENGE = 'challenge';
export const CELEBRATE = 'celebrate';

const getOrg = (
  orgId: string,
  getState: () => { organizations: OrganizationsState },
) =>
  organizationSelector(
    { organizations: getState().organizations },
    { orgId: orgId },
  );

const getFeedType = (type: string, orgId: string) =>
  type === CHALLENGE
    ? REQUESTS.GET_GROUP_CHALLENGE_FEED
    : orgId === GLOBAL_COMMUNITY_ID
    ? REQUESTS.GET_GLOBAL_CELEBRATE_FEED
    : REQUESTS.GET_GROUP_CELEBRATE_FEED;

const getPaginationType = (type: string) =>
  type === CHALLENGE ? 'challengePagination' : 'celebratePagination';

// Query for the celebrate and challenge feeds
function buildQuery(
  type: string,
  orgId: string,
  page: number,
  personId: string | null,
) {
  return {
    page: {
      limit: DEFAULT_PAGE_LIMIT,
      offset: DEFAULT_PAGE_LIMIT * page,
    },
    ...(type === CELEBRATE ? { orgId, include: GET_CELEBRATE_INCLUDE } : {}),
    ...(type === CELEBRATE && personId
      ? { filters: { subject_person_ids: personId } }
      : {}),
    ...(type === CHALLENGE
      ? {
          filters: {
            organization_ids: orgId === GLOBAL_COMMUNITY_ID ? 'null' : orgId,
          },
          sort: '-active,-created_at',
        }
      : {}),
  };
}

const resetPaginationAction = (type: string, orgId: string) => ({
  type:
    type === CHALLENGE
      ? RESET_CHALLENGE_PAGINATION
      : RESET_CELEBRATION_PAGINATION,
  orgId,
});

// Use this for the challenge and celebrate feeds
export function getFeed(
  type: string,
  orgId: string,
  personId: string | null = null,
) {
  return (
    dispatch: ThunkDispatch<{}, {}, any>,
    getState: () => { organizations: OrganizationsState },
  ) => {
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
export function reloadFeed(type: string, orgId: string) {
  return (
    dispatch: ThunkDispatch<{}, {}, any>,
    getState: () => { organizations: OrganizationsState },
  ) => {
    const org = getOrg(orgId, getState);
    const pagingType = getPaginationType(type);

    if (org) {
      if (org[pagingType]) {
        dispatch(resetPaginationAction(type, orgId));
      }
      //Sometimes reload gets called when no items had been loaded previously.  Call getFeed anyway for first set.
      return dispatch(getFeed(type, orgId));
    }
    return Promise.resolve();
  };
}
