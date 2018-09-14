import { DEFAULT_PAGE_LIMIT, RESET_CHALLENGE_PAGINATION } from '../constants';
import { formatApiDate } from '../utils/common';

import callApi, { REQUESTS } from './api';

// TODO: Combine the logic for challenges and celebration because they are so similar
export function getGroupChallengeFeed(orgId) {
  return (dispatch, getState) => {
    const org = (getState().organizations.all || []).find(o => o.id === orgId);

    const { page, hasNextPage } = org.challengePagination
      ? org.challengePagination
      : { page: 0, hasNextPage: true };

    if (!hasNextPage) {
      // Does not have more data
      return Promise.resolve();
    }
    const query = buildQuery(orgId, page);
    return dispatch(callApi(REQUESTS.GET_GROUP_CHALLENGE_FEED, query));
  };
}

export function reloadGroupChallengeFeed(orgId) {
  return (dispatch, getState) => {
    const org = (getState().organizations.all || []).find(o => o.id === orgId);

    if (org && org.challengePagination) {
      dispatch(resetPaginationAction(orgId));
      return dispatch(getGroupChallengeFeed(orgId));
    }
    return Promise.resolve();
  };
}

const resetPaginationAction = orgId => ({
  type: RESET_CHALLENGE_PAGINATION,
  orgId,
});

function buildQuery(orgId, page) {
  return {
    page: {
      limit: DEFAULT_PAGE_LIMIT,
      offset: DEFAULT_PAGE_LIMIT * page,
    },
    filters: {
      organization_ids: orgId,
    },
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
