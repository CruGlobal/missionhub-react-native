import { formatApiDate } from '../utils/common';
import { getFeed, reloadFeed, CHALLENGE } from '../utils/actions';

import callApi, { REQUESTS } from './api';
import { reloadGroupCelebrateFeed } from './celebration';

export function getGroupChallengeFeed(orgId) {
  return dispatch => {
    return dispatch(getFeed(CHALLENGE, orgId));
  };
}

export function reloadGroupChallengeFeed(orgId) {
  return dispatch => {
    return dispatch(reloadFeed(CHALLENGE, orgId));
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
    dispatch(reloadGroupChallengeFeed(orgId));
    // After completing a challenge, reload the group celebrate feed with this new item
    dispatch(reloadGroupCelebrateFeed(orgId));
  };
}

export function joinChallenge(item, orgId) {
  const query = {
    challengeId: item.id,
  };
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
  if (!challenge || !challenge.id) {
    return Promise.reject(
      `Invalid Data from updateChallenge: no challenge passed in`,
    );
  }
  const query = {
    challengeId: challenge.id,
  };
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
