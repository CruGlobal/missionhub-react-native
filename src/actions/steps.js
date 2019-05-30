/* eslint complexity: 0, max-lines: 0, max-lines-per-function: 0 */

import i18next from 'i18next';

import {
  COMPLETED_STEP_COUNT,
  STEP_NOTE,
  ACTIONS,
  ACCEPTED_STEP,
} from '../constants';
import {
  buildTrackingObj,
  formatApiDate,
  getAnalyticsSubsection,
  isCustomStep,
} from '../utils/common';
import {
  COMPLETE_STEP_FLOW,
  COMPLETE_STEP_FLOW_NAVIGATE_BACK,
} from '../routes/constants';
import { apolloClient } from '../apolloClient';
import { STEPS_QUERY } from '../containers/StepsScreen';

import { refreshImpact } from './impact';
import { navigatePush } from './navigation';
import callApi, { REQUESTS } from './api';
import { trackAction, trackStepAdded } from './analytics';
import { reloadGroupCelebrateFeed } from './celebration';

export function getStepSuggestions(isMe, contactStageId) {
  return dispatch => {
    const language = i18next.language;
    const query = {
      filters: {
        locale: language,
        self_step: isMe,
        pathway_stage_id: contactStageId,
      },
    };

    return dispatch(callApi(REQUESTS.GET_CHALLENGE_SUGGESTIONS, query));
  };
}

export function getContactSteps(personId, orgId) {
  return dispatch => {
    const query = {
      filters: {
        receiver_ids: personId,
        organization_ids: orgId || 'personal',
      },
      include: 'receiver,challenge_suggestion,reminder',
      page: { limit: 1000 },
    };
    return dispatch(callApi(REQUESTS.GET_CHALLENGES_BY_FILTER, query));
  };
}

export function addStep(stepSuggestion, receiverId, organization) {
  return async dispatch => {
    const payload = {
      data: {
        type: ACCEPTED_STEP,
        attributes: {
          title: stepSuggestion.body,
        },
        relationships: {
          receiver: {
            data: {
              type: 'person',
              id: receiverId,
            },
          },
          challenge_suggestion: {
            data: {
              type: 'challenge_suggestion',
              id:
                stepSuggestion && isCustomStep(stepSuggestion)
                  ? null
                  : (stepSuggestion || {}).id,
            },
          },
          ...(organization && organization.id !== 'personal'
            ? {
                organization: {
                  data: {
                    type: 'organization',
                    id: organization.id,
                  },
                },
              }
            : {}),
        },
      },
    };

    await dispatch(callApi(REQUESTS.ADD_CHALLENGE, {}, payload));
    dispatch(trackStepAdded(stepSuggestion));
  };
}

export function updateChallengeNote(stepId, note) {
  return dispatch => {
    const query = { challenge_id: stepId };
    const data = buildChallengeData({ note });

    return dispatch(callApi(REQUESTS.CHALLENGE_COMPLETE, query, data));
  };
}

function buildChallengeData(attributes) {
  return {
    data: {
      type: ACCEPTED_STEP,
      attributes,
    },
  };
}

function completeChallengeAPI(step) {
  return async dispatch => {
    const { id: stepId, receiver, organization } = step;
    const receiverId = (receiver && receiver.id) || null;
    const orgId = (organization && organization.id) || null;

    const query = { challenge_id: stepId };
    const data = buildChallengeData({ completed_at: formatApiDate() });

    await dispatch(callApi(REQUESTS.CHALLENGE_COMPLETE, query, data));
    dispatch({ type: COMPLETED_STEP_COUNT, userId: receiverId });
    dispatch(refreshImpact(orgId));

    apolloClient.query({ query: STEPS_QUERY, fetchPolicy: 'network-only' });
    dispatch(getContactSteps(receiverId, orgId));

    if (orgId) {
      dispatch(reloadGroupCelebrateFeed(orgId));
    }
  };
}

export function completeStep(step, screen, extraBack = false) {
  return (dispatch, getState) => {
    const {
      auth: {
        person: { id: myId },
      },
    } = getState();
    const { id: stepId, receiver, organization } = step;
    const receiverId = (receiver && receiver.id) || null;
    const orgId = (organization && organization.id) || null;

    const subsection = getAnalyticsSubsection(receiverId, myId);

    dispatch(
      navigatePush(
        extraBack ? COMPLETE_STEP_FLOW_NAVIGATE_BACK : COMPLETE_STEP_FLOW,
        {
          stepId,
          personId: receiverId,
          orgId,
          onSetComplete: () => dispatch(completeChallengeAPI(step)),
          type: STEP_NOTE,
          trackingObj: buildTrackingObj(
            `people : ${subsection} : steps : complete comment`,
            'people',
            subsection,
            'steps',
          ),
        },
      ),
    );

    dispatch(
      trackAction(`${ACTIONS.STEP_COMPLETED.name} on ${screen} Screen`, {
        [ACTIONS.STEP_COMPLETED.key]: null,
      }),
    );
  };
}

export function deleteStepWithTracking(step, screen) {
  return async dispatch => {
    await dispatch(deleteStep(step));
    dispatch(
      trackAction(`${ACTIONS.STEP_REMOVED.name} on ${screen} Screen`, {
        [ACTIONS.STEP_REMOVED.key]: null,
      }),
    );
  };
}

function deleteStep(step) {
  return dispatch => {
    const query = { challenge_id: step.id };
    return dispatch(callApi(REQUESTS.DELETE_CHALLENGE, query, {}));
  };
}
