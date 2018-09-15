import {
  DEFAULT_PAGE_LIMIT,
  RESET_CHALLENGE_PAGINATION,
  RESET_CELEBRATION_PAGINATION,
} from '../constants';
import { formatApiDate } from '../utils/common';

import callApi, { REQUESTS } from './api';

const getOrg = (orgId, getState) =>
  (getState().organizations.all || []).find(o => o.id === orgId);

const getFeedType = type =>
  type === 'challenge'
    ? REQUESTS.GET_GROUP_CHALLENGE_FEED
    : REQUESTS.GET_GROUP_CELEBRATE_FEED;

const getPaginationType = type =>
  type === 'challenge' ? 'challengePagination' : 'celebratePagination';

// Query for the celebrate and challenge feeds
function buildQuery(type, orgId, page, personId) {
  return {
    page: {
      limit: DEFAULT_PAGE_LIMIT,
      offset: DEFAULT_PAGE_LIMIT * page,
    },
    ...(type === 'celebrate' ? { orgId } : {}),
    ...(type === 'celebrate' && personId
      ? { filters: { subject_person_ids: personId } }
      : {}),
    ...(type === 'challenge' ? { filters: { organization_ids: orgId } } : {}),
  };
}

const resetPaginationAction = (type, orgId) => {
  return {
    type:
      type === 'challenge'
        ? RESET_CHALLENGE_PAGINATION
        : RESET_CELEBRATION_PAGINATION,
    orgId,
  };
};

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

    return dispatch(callApi(getFeedType(type), query));
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

export function getGroupChallengeFeed(orgId) {
  return dispatch => {
    return dispatch(getFeed('challenge', orgId));
  };
}

export function reloadGroupChallengeFeed(orgId) {
  return dispatch => {
    return dispatch(reloadFeed('challenge', orgId));
  };
}

export function completeChallenge(item, orgId) {
  const query = {
    challengeId: item.id,
  };
  const bodyData = {
    data: {
      attributes: {
        completed_at: formatApiDate(),
      },
    },
  };
  return async dispatch => {
    await dispatch(callApi(REQUESTS.COMPLETE_GROUP_CHALLENGE, query, bodyData));
    return dispatch(reloadGroupChallengeFeed(orgId));
  };
}

export function joinChallenge(item, orgId) {
  const query = {};
  const bodyData = {
    data: {
      attributes: {
        community_challenge_id: item.id,
      },
    },
  };
  return async dispatch => {
    await dispatch(callApi(REQUESTS.ACCEPT_GROUP_CHALLENGE, query, bodyData));
    return dispatch(reloadGroupChallengeFeed(orgId));
  };
}

export function createChallenge(challenge, orgId) {
  const query = {};
  const bodyData = {
    data: {
      attributes: {
        title: challenge.title,
        end_date: challenge.date,
        organization_id: orgId,
      },
    },
  };
  return async dispatch => {
    await dispatch(callApi(REQUESTS.CREATE_GROUP_CHALLENGE, query, bodyData));
    return dispatch(reloadGroupChallengeFeed(orgId));
  };
}

export function updateChallenge(challenge, orgId) {
  const query = {};
  if (!challenge || !challenge.id) {
    return Promise.reject(
      `Invalid Data from updateChallenge: no challenge passed in`,
    );
  }
  const attributes = {};
  if (challenge.title) {
    attributes.title = challenge.title;
  }
  if (challenge.date) {
    attributes.end_date = challenge.date;
  }
  const bodyData = { data: { attributes } };
  return async dispatch => {
    await dispatch(callApi(REQUESTS.UPDATE_GROUP_CHALLENGE, query, bodyData));
    return dispatch(reloadGroupChallengeFeed(orgId));
  };
}
