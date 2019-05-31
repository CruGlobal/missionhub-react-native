/* eslint complexity: 0, max-lines-per-function: 0 */

import { REQUESTS } from '../actions/api';
import { LOGOUT, COMPLETED_STEP_COUNT, RESET_STEP_COUNT } from '../constants';
import { shuffleArray } from '../utils/common';

const initialState = {
  suggestedForMe: {},
  suggestedForOthers: {},
  userStepCount: {},
  pagination: {
    hasNextPage: true,
    page: 1,
  },
  contactSteps: {},
};

export default function stepsReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTS.GET_CHALLENGE_SUGGESTIONS.SUCCESS:
      const contactStageId = action.query.filters.pathway_stage_id;
      const isMe = action.query.filters.self_step;
      const suggestions = shuffleArray(action.results.response);

      return {
        ...state,
        suggestedForMe: {
          ...state.suggestedForMe,
          [contactStageId]: isMe
            ? suggestions
            : state.suggestedForMe[contactStageId],
        },
        suggestedForOthers: {
          ...state.suggestedForOthers,
          [contactStageId]: isMe
            ? state.suggestedForOthers[contactStageId]
            : suggestions,
        },
      };
    case REQUESTS.GET_CHALLENGES_BY_FILTER.SUCCESS:
      const {
        receiver_ids: personId,
        organization_ids: orgId,
      } = action.query.filters;
      const allStepsFilter = action.results.response || [];
      return {
        ...state,
        contactSteps: {
          ...state.contactSteps,
          [`${personId}-${orgId}`]: {
            steps: allStepsFilter.filter(s => !s.completed_at),
            completedSteps: sortByCompleted(
              allStepsFilter.filter(s => s.completed_at),
            ),
          },
        },
      };
    case REQUESTS.ADD_CHALLENGE.SUCCESS: {
      const newStep = action.results.response;

      const {
        receiver: { id: personId },
        organization,
      } = newStep;

      const personOrgId = `${personId}-${(organization || {}).id ||
        'personal'}`;
      const personOrgValue = state.contactSteps[personOrgId] || {
        steps: [],
        completedSteps: [],
      };

      return {
        ...state,
        mine: [newStep, ...(state.mine || [])],
        contactSteps: {
          ...state.contactSteps,
          [personOrgId]: {
            ...personOrgValue,
            steps: [newStep, ...personOrgValue.steps],
          },
        },
      };
    }
    case REQUESTS.DELETE_CHALLENGE.SUCCESS:
      const { challenge_id: stepId } = action.query;

      const removeStepById = (stepId, steps) =>
        steps.filter(({ id }) => id !== stepId);

      return {
        ...state,
        mine: state.mine === null ? null : removeStepById(stepId, state.mine),
        contactSteps: Object.entries(state.contactSteps).reduce(
          (acc, [personOrgId, combinedSteps]) => ({
            ...acc,
            [personOrgId]: {
              ...combinedSteps,
              steps: removeStepById(stepId, combinedSteps.steps),
            },
          }),
          {},
        ),
      };
    case COMPLETED_STEP_COUNT:
      const currentCount = state.userStepCount[action.userId] || 0;
      return {
        ...state,
        userStepCount: {
          ...state.userStepCount,
          [action.userId]: currentCount + 1,
        },
      };
    case RESET_STEP_COUNT:
      return {
        ...state,
        userStepCount: {
          ...state.userStepCount,
          [action.userId]: 0,
        },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

function sortByCompleted(arr) {
  // Sort by most recent date first
  arr.sort((a, b) => {
    const aDate = new Date(a.completed_at);
    const bDate = new Date(b.completed_at);
    if (aDate > bDate) {
      return -1;
    }
    if (aDate < bDate) {
      return 1;
    }
    return 0;
  });
  return arr;
}
