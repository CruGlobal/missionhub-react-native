/* eslint-disable @typescript-eslint/no-explicit-any */

import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { formatApiDate } from '../utils/common';
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
import { checkNotifications } from './notifications';
import { navigatePush, navigateBack } from './navigation';
import { trackActionWithoutData } from './analytics';
import { getCelebrateFeed } from './celebration';

export function getGroupChallengeFeed(orgId: string) {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    return dispatch<any>(getFeed(CHALLENGE, orgId));
  };
}

export function reloadGroupChallengeFeed(orgId = GLOBAL_COMMUNITY_ID) {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    return dispatch<any>(reloadFeed(CHALLENGE, orgId));
  };
}

export function completeChallenge(item: { id: string }, orgId: string) {
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

  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    await dispatch<any>(
      callApi(REQUESTS.COMPLETE_GROUP_CHALLENGE, query, bodyData),
    );
    dispatch<any>(
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

export function joinChallenge(item: { id: string }, orgId: string) {
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

  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    await dispatch<any>(
      callApi(REQUESTS.ACCEPT_GROUP_CHALLENGE, query, bodyData),
    );
    dispatch<any>(trackActionWithoutData(ACTIONS.CHALLENGE_JOINED));
    dispatch(reloadGroupChallengeFeed(orgId));
    getCelebrateFeed(orgId);

    await dispatch<any>(
      checkNotifications(
        NOTIFICATION_PROMPT_TYPES.JOIN_CHALLENGE,
        ({ showedPrompt }) =>
          dispatch(
            navigatePush(CELEBRATION_SCREEN, {
              onComplete: () => {
                dispatch(navigateBack(showedPrompt ? 2 : 1));
              },
              gifId: 0,
            }),
          ),
      ),
    );
  };
}

export function createChallenge(
  challenge: { title: string; date: string },
  orgId: string,
) {
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

  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    await dispatch<any>(
      callApi(REQUESTS.CREATE_GROUP_CHALLENGE, query, bodyData),
    );
    dispatch(trackActionWithoutData(ACTIONS.CHALLENGE_CREATED));
    return dispatch(reloadGroupChallengeFeed(orgId));
  };
}

export function updateChallenge(challenge: {
  id: string;
  title?: string;
  date?: string;
}) {
  if (!challenge) {
    return Promise.reject(
      'Invalid Data from updateChallenge: no challenge passed in',
    );
  }

  const challenge_id = challenge.id;

  const query = {
    challenge_id,
  };
  const attributes: { [key: string]: string } = {};
  if (challenge.title) {
    attributes.title = challenge.title;
  }
  if (challenge.date) {
    attributes.end_date = challenge.date;
  }
  const bodyData = { data: { attributes } };

  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const { response = {} } = await dispatch<any>(
      callApi(REQUESTS.UPDATE_GROUP_CHALLENGE, query, bodyData),
    );
    return dispatch({
      type: UPDATE_CHALLENGE,
      challenge: {
        id: challenge_id,
        organization: response.organization,
        title: response.title,
        end_date: response.end_date,
      },
    });
  };
}

export function getChallenge(challenge_id: string) {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const query = {
      challenge_id,
      include:
        'accepted_community_challenges.person.first_name,accepted_community_challenges.person.last_name,accepted_community_challenges.person.organizational_permissions',
    };

    const { response } = await dispatch<any>(
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
