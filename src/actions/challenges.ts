import { formatApiDate } from '../utils/date';
import { getFeed, reloadFeed, CHALLENGE } from '../utils/actions';
import { CELEBRATION_SCREEN } from '../containers/CelebrationScreen';
import {
  UPDATE_CHALLENGE,
  ACTIONS,
  NOTIFICATION_PROMPT_TYPES,
  GLOBAL_COMMUNITY_ID,
} from '../constants';
import { REQUESTS } from '../api/routes';

import callApi from './api';
import { showNotificationPrompt } from './notifications';
import { navigatePush, navigateBack } from './navigation';
import { trackActionWithoutData } from './analytics';
import { getCelebrateFeed } from './celebration';

// @ts-ignore
export function getGroupChallengeFeed(orgId) {
  // @ts-ignore
  return dispatch => {
    return dispatch(getFeed(CHALLENGE, orgId));
  };
}

export function reloadGroupChallengeFeed(orgId = GLOBAL_COMMUNITY_ID) {
  // @ts-ignore
  return dispatch => {
    return dispatch(reloadFeed(CHALLENGE, orgId));
  };
}

// @ts-ignore
export function completeChallenge(item, orgId) {
  const query = {
    challengeId: item.id,
  };
  const bodyData = {
    data: {
      attributes: {
        // @ts-ignore
        completed_at: formatApiDate(),
      },
    },
  };
  // @ts-ignore
  return async dispatch => {
    await dispatch(callApi(REQUESTS.COMPLETE_GROUP_CHALLENGE, query, bodyData));
    dispatch(
      navigatePush(CELEBRATION_SCREEN, {
        onComplete: () => {
          dispatch(navigateBack());
        },
      }),
    );
    dispatch(trackActionWithoutData(ACTIONS.CHALLENGE_COMPLETED));
    dispatch(reloadGroupChallengeFeed(orgId));
    getCelebrateFeed(orgId);
  };
}

// @ts-ignore
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
  // @ts-ignore
  return async dispatch => {
    await dispatch(callApi(REQUESTS.ACCEPT_GROUP_CHALLENGE, query, bodyData));
    await dispatch(
      // @ts-ignore
      showNotificationPrompt(NOTIFICATION_PROMPT_TYPES.JOIN_CHALLENGE),
    );
    dispatch(
      navigatePush(CELEBRATION_SCREEN, {
        onComplete: () => {
          dispatch(navigateBack());
        },
        gifId: 0,
      }),
    );
    dispatch(trackActionWithoutData(ACTIONS.CHALLENGE_JOINED));
    dispatch(reloadGroupChallengeFeed(orgId));
    getCelebrateFeed(orgId);
  };
}

// @ts-ignore
export function createChallenge(challenge, orgId) {
  const query = {};
  const bodyData = {
    data: {
      attributes: {
        title: challenge.title,
        end_date: challenge.date,
        organization_id: orgId,
        details_markdown: challenge.details,
      },
    },
  };
  // @ts-ignore
  return async dispatch => {
    await dispatch(callApi(REQUESTS.CREATE_GROUP_CHALLENGE, query, bodyData));
    await dispatch(
      navigatePush(CELEBRATION_SCREEN, {
        onComplete: () => {
          dispatch(navigateBack(2));
        },
      }),
    );
    dispatch(trackActionWithoutData(ACTIONS.CHALLENGE_CREATED));
    return dispatch(reloadGroupChallengeFeed(orgId));
  };
}

// @ts-ignore
export function updateChallenge(challenge) {
  if (!challenge) {
    return Promise.reject(
      'Invalid Data from updateChallenge: no challenge passed in',
    );
  }

  const challenge_id = challenge.id;

  const query = {
    challenge_id,
  };
  const attributes = {};
  if (challenge.title) {
    // @ts-ignore
    attributes.title = challenge.title;
  }
  if (challenge.date) {
    // @ts-ignore
    attributes.end_date = challenge.date;
  }
  // @ts-ignore
  attributes.details_markdown = challenge.details;

  const bodyData = { data: { attributes } };
  // @ts-ignore
  return async dispatch => {
    const { response = {} } = await dispatch(
      callApi(REQUESTS.UPDATE_GROUP_CHALLENGE, query, bodyData),
    );
    return dispatch({
      type: UPDATE_CHALLENGE,
      challenge: {
        id: challenge_id,
        organization: response.organization,
        title: response.title,
        end_date: response.end_date,
        details_markdown: response.details_markdown,
      },
    });
  };
}

// @ts-ignore
export function getChallenge(challenge_id) {
  // @ts-ignore
  return async dispatch => {
    const query = {
      challenge_id,
      include:
        'accepted_community_challenges.person.first_name,accepted_community_challenges.person.last_name,accepted_community_challenges.person.organizational_permissions',
    };

    const { response } = await dispatch(
      callApi(REQUESTS.GET_GROUP_CHALLENGE, query),
    );
    return dispatch({
      type: UPDATE_CHALLENGE,
      challenge: {
        id: challenge_id,
        ...response,
      },
    });
  };
}
