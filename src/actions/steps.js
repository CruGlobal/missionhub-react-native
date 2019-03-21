/* eslint complexity: 0, max-lines: 0, max-lines-per-function: 0 */

import i18next from 'i18next';

import {
  TOGGLE_STEP_FOCUS,
  COMPLETED_STEP_COUNT,
  STEP_NOTE,
  ACTIONS,
  DEFAULT_PAGE_LIMIT,
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

export function getMySteps(query = {}) {
  return dispatch => {
    const queryObj = {
      order: '-focused_at,-accepted_at',
      ...query,
      filters: {
        ...(query.filters || {}),
        completed: false,
      },
      include:
        'receiver.reverse_contact_assignments,receiver.organizational_permissions,challenge_suggestion',
    };
    return dispatch(callApi(REQUESTS.GET_MY_CHALLENGES, queryObj));
  };
}

export function getMyStepsNextPage() {
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

export function getContactSteps(personId, orgId) {
  return dispatch => {
    const query = {
      filters: {
        receiver_ids: personId,
        organization_ids: orgId || 'personal',
      },
      include: 'receiver,challenge_suggestion',
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

export function setStepFocus(step, isFocus) {
  return async dispatch => {
    const query = { challenge_id: step.id };
    const data = {
      data: {
        type: ACCEPTED_STEP,
        attributes: {
          organization_id: step.organization ? step.organization.id : null,
          focus: isFocus,
        },
        relationships: {
          receiver: {
            data: {
              type: 'person',
              id: step.receiver.id,
            },
          },
        },
      },
    };

    const { response } = await dispatch(
      callApi(REQUESTS.CHALLENGE_SET_FOCUS, query, data),
    );
    if (step.focus !== response.focus) {
      dispatch({ type: TOGGLE_STEP_FOCUS, step });
    }
  };
}

export function updateChallengeNote(stepId, note) {
  return dispatch => {
    const query = { challenge_id: stepId };
    const data = buildChallengeData({ note });

    return dispatch(callApi(REQUESTS.CHALLENGE_COMPLETE, query, data));
  };
}

export function completeStepReminder(step, screen) {
  return dispatch => {
    return dispatch(challengeCompleteAction(step, screen)).then(r => {
      dispatch(getMySteps());
      dispatch(setStepFocus(step, false));
      return r;
    });
  };
}

export function completeStep(step, screen, extraBack) {
  return async dispatch => {
    const result = await dispatch(
      challengeCompleteAction(step, screen, extraBack),
    );

    dispatch(getMySteps());
    dispatch(
      getContactSteps(
        step.receiver && step.receiver.id,
        step.organization && step.organization.id,
      ),
    );

    if (step.organization) {
      dispatch(reloadGroupCelebrateFeed(step.organization.id));
    }
    return result;
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

function challengeCompleteAction(step, screen, extraBack = false) {
  return async (dispatch, getState) => {
    const {
      auth: {
        person: { id: myId },
      },
    } = getState();
    const { id: stepId, receiver, organization } = step;
    const receiverId = (receiver && receiver.id) || null;
    const orgId = (organization && organization.id) || null;

    const query = { challenge_id: stepId };
    const data = buildChallengeData({ completed_at: formatApiDate() });

    await dispatch(callApi(REQUESTS.CHALLENGE_COMPLETE, query, data));
    dispatch({ type: COMPLETED_STEP_COUNT, userId: receiverId });
    dispatch(refreshImpact(orgId));

    const subsection = getAnalyticsSubsection(receiverId, myId);

    dispatch(
      navigatePush(
        extraBack ? COMPLETE_STEP_FLOW_NAVIGATE_BACK : COMPLETE_STEP_FLOW,
        {
          stepId,
          personId: receiverId,
          orgId,
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
