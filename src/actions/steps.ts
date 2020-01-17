/* eslint complexity: 0, max-lines: 0, max-lines-per-function: 0 */

import i18next from 'i18next';

import {
  COMPLETED_STEP_COUNT,
  STEP_NOTE,
  ACTIONS,
  DEFAULT_PAGE_LIMIT,
  ACCEPTED_STEP,
} from '../constants';
import { formatApiDate, isCustomStep } from '../utils/common';
import { buildCustomStep } from '../utils/steps';
import {
  COMPLETE_STEP_FLOW,
  COMPLETE_STEP_FLOW_NAVIGATE_BACK,
} from '../routes/constants';
import { REQUESTS } from '../api/routes';

import { refreshImpact } from './impact';
import { navigatePush } from './navigation';
import callApi from './api';
import { trackAction, trackStepAdded } from './analytics';
import { reloadGroupCelebrateFeed } from './celebration';

// @ts-ignore
export function getStepSuggestions(isMe, contactStageId) {
  // @ts-ignore
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

export function getMySteps(query = {}) {
  // @ts-ignore
  return dispatch => {
    const queryObj = {
      order: '-accepted_at',
      ...query,
      filters: {
        // @ts-ignore
        ...(query.filters || {}),
        completed: false,
      },
      include:
        'receiver,receiver.reverse_contact_assignments,receiver.organizational_permissions,challenge_suggestion,reminder',
    };
    return dispatch(callApi(REQUESTS.GET_MY_CHALLENGES, queryObj));
  };
}

export function getMyStepsNextPage() {
  // @ts-ignore
  return (dispatch, getState) => {
    const { page, hasNextPage } = getState().steps.pagination;
    if (!hasNextPage) {
      // Does not have more data
      return Promise.resolve();
    }
    const query = {
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * page,
      },
      include: '',
    };
    return dispatch(getMySteps(query));
  };
}

// @ts-ignore
export function getContactSteps(personId, orgId) {
  // @ts-ignore
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

// @ts-ignore
export function addStep(stepSuggestion, personId, orgId) {
  // @ts-ignore
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
              id: personId,
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
          ...(orgId && orgId !== 'personal'
            ? {
                organization: {
                  data: {
                    type: 'organization',
                    id: orgId,
                  },
                },
              }
            : {}),
        },
      },
    };

    await dispatch(callApi(REQUESTS.ADD_CHALLENGE, {}, payload));
    dispatch(trackStepAdded(stepSuggestion));
    dispatch(getMySteps());
    dispatch(getContactSteps(personId, orgId));
  };
}

// @ts-ignore
export function createCustomStep(stepText, personId, orgId) {
  // @ts-ignore
  return (dispatch, getState) => {
    const {
      auth: {
        person: { id: myId },
      },
    } = getState();
    const isMe = personId === myId;

    dispatch(addStep(buildCustomStep(stepText, isMe), personId, orgId));
  };
}

// @ts-ignore
export function updateChallengeNote(stepId, note) {
  // @ts-ignore
  return dispatch => {
    const query = { challenge_id: stepId };
    const data = buildChallengeData({ note });

    return dispatch(callApi(REQUESTS.CHALLENGE_COMPLETE, query, data));
  };
}

// @ts-ignore
function buildChallengeData(attributes) {
  return {
    data: {
      type: ACCEPTED_STEP,
      attributes,
    },
  };
}

// @ts-ignore
function completeChallengeAPI(step) {
  // @ts-ignore
  return async dispatch => {
    const { id: stepId, receiver, organization } = step;
    const receiverId = (receiver && receiver.id) || null;
    const orgId = (organization && organization.id) || null;

    const query = { challenge_id: stepId };
    // @ts-ignore
    const data = buildChallengeData({ completed_at: formatApiDate() });

    await dispatch(callApi(REQUESTS.CHALLENGE_COMPLETE, query, data));
    dispatch({ type: COMPLETED_STEP_COUNT, userId: receiverId });
    dispatch(refreshImpact(orgId));

    dispatch(getMySteps());
    dispatch(getContactSteps(receiverId, orgId));

    if (orgId) {
      dispatch(reloadGroupCelebrateFeed(orgId));
    }
  };
}

// @ts-ignore
export function completeStep(step, screen, extraBack = false) {
  // @ts-ignore
  return dispatch => {
    const { id: stepId, receiver, organization } = step;
    const receiverId = (receiver && receiver.id) || null;
    const orgId = (organization && organization.id) || null;

    dispatch(
      navigatePush(
        extraBack ? COMPLETE_STEP_FLOW_NAVIGATE_BACK : COMPLETE_STEP_FLOW,
        {
          id: stepId,
          personId: receiverId,
          orgId,
          onSetComplete: () => dispatch(completeChallengeAPI(step)),
          type: STEP_NOTE,
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

// @ts-ignore
export function deleteStepWithTracking(step, screen) {
  // @ts-ignore
  return async dispatch => {
    await dispatch(deleteStep(step));
    dispatch(
      trackAction(`${ACTIONS.STEP_REMOVED.name} on ${screen} Screen`, {
        [ACTIONS.STEP_REMOVED.key]: null,
      }),
    );
  };
}

// @ts-ignore
function deleteStep(step) {
  // @ts-ignore
  return dispatch => {
    const query = { challenge_id: step.id };
    return dispatch(callApi(REQUESTS.DELETE_CHALLENGE, query, {}));
  };
}
