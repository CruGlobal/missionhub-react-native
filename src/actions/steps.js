import i18next from 'i18next';

import {
  TOGGLE_STEP_FOCUS,
  COMPLETED_STEP_COUNT,
  RESET_STEP_COUNT,
  STEP_NOTE,
  ACTIONS,
  DEFAULT_PAGE_LIMIT,
} from '../constants';
import {
  buildTrackingObj,
  formatApiDate,
  getAnalyticsSubsection,
  isCustomStep,
  getStageIndex,
} from '../utils/common';
import { ADD_STEP_SCREEN } from '../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../containers/CelebrationScreen';
import { STAGE_SCREEN } from '../containers/StageScreen';
import { PERSON_STAGE_SCREEN } from '../containers/PersonStageScreen';
import { COMPLETE_STEP_FLOW } from '../routes/constants';

import { refreshImpact } from './impact';
import { getPersonDetails } from './person';
import { navigatePush, navigateBack } from './navigation';
import callApi, { REQUESTS } from './api';
import { trackAction, trackStepsAdded } from './analytics';
import { reloadJourney } from './journey';
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
        'receiver.reverse_contact_assignments,receiver.organizational_permissions',
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
        completed: false,
        receiver_ids: personId,
        organization_ids: orgId || 'personal',
      },
      include: 'receiver',
      page: { limit: 1000 },
    };
    return dispatch(callApi(REQUESTS.GET_CHALLENGES_BY_FILTER, query));
  };
}

export function addSteps(steps, receiverId, organization) {
  return dispatch => {
    const query = {
      person_id: receiverId,
    };
    const newSteps = steps.map(s => ({
      type: 'accepted_challenge',
      attributes: {
        title: s.body,
        challenge_suggestion_id: s && isCustomStep(s) ? null : (s || {}).id,
        ...(organization && organization.id !== 'personal'
          ? { organization_id: organization.id }
          : {}),
      },
    }));

    const data = {
      included: newSteps,
      include: 'received_challenges',
    };
    return dispatch(callApi(REQUESTS.ADD_CHALLENGES, query, data)).then(r => {
      dispatch(getMySteps());
      dispatch(trackStepsAdded(steps));

      return r;
    });
  };
}

export function setStepFocus(step, isFocus) {
  return async dispatch => {
    const query = { challenge_id: step.id };
    const data = {
      data: {
        type: 'accepted_challenge',
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

export function completeStep(step, screen) {
  return dispatch => {
    return dispatch(challengeCompleteAction(step, screen)).then(r => {
      dispatch(getMySteps());
      if (step.organization) {
        dispatch(reloadGroupCelebrateFeed(step.organization.id));
      }
      return r;
    });
  };
}

function buildChallengeData(attributes) {
  return {
    data: {
      type: 'accepted_challenge',
      attributes,
    },
  };
}

function challengeCompleteAction(step, screen) {
  return async (dispatch, getState) => {
    const {
      id: stepId,
      receiver: { id: personId },
      organization: { id: orgId },
    } = step;

    const query = { challenge_id: stepId };
    const data = buildChallengeData({ completed_at: formatApiDate() });
    const {
      auth: {
        person: { id: myId },
      },
    } = getState();

    await dispatch(callApi(REQUESTS.CHALLENGE_COMPLETE, query, data));

    const subsection = getAnalyticsSubsection(personId, myId);

    dispatch({ type: COMPLETED_STEP_COUNT, userId: personId });
    dispatch(refreshImpact(orgId));

    dispatch(navigatePush(COMPLETE_STEP_FLOW, { stepId, personId, orgId }));
  };
}

function celebrateAndComplete(numTimesBack, trackingObj) {
  return dispatch => {
    dispatch(
      navigatePush(CELEBRATION_SCREEN, {
        onComplete: () => dispatch(navigateBack(numTimesBack)),
        trackingObj,
      }),
    );
  };
}

export function deleteStepWithTracking(step, screen) {
  return dispatch => {
    return dispatch(deleteStep(step)).then(r => {
      dispatch(
        trackAction(`${ACTIONS.STEP_REMOVED.name} on ${screen} Screen`, {
          [ACTIONS.STEP_REMOVED.key]: null,
        }),
      );
      return r;
    });
  };
}

function deleteStep(step) {
  return dispatch => {
    const query = { challenge_id: step.id };
    return dispatch(callApi(REQUESTS.DELETE_CHALLENGE, query, {})).then(r => {
      dispatch(getMySteps());
      return r;
    });
  };
}
