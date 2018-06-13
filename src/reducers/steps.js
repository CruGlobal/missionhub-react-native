import { REQUESTS } from '../actions/api';
import { LOGOUT, TOGGLE_STEP_FOCUS, COMPLETED_STEP_COUNT } from '../constants';
import { getPagination } from '../utils/common';

const initialState = {
  mine: null, // null indicates user has never loaded. [] indicates loaded but user doesn't have any
  suggestedForMe: {},
  suggestedForOthers: {},
  userStepCount: {},
  pagination: {
    hasNextPage: true,
    page: 0,
  },
  contactSteps: {},
};

export default function stepsReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTS.GET_CHALLENGE_SUGGESTIONS.SUCCESS:
      const contactStageId = action.query.filters.pathway_stage_id;
      const isMe = action.query.filters.self_step;
      const suggestions = action.results.response;
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
    case REQUESTS.GET_MY_CHALLENGES.SUCCESS:
      const newSteps = action.results.response;
      // If we're doing paging, concat the old steps with the new ones
      const allSteps =
        action.query.page && action.query.page.offset > 0
          ? [...(state.mine || []), ...newSteps]
          : newSteps;

      return {
        ...state,
        mine: allSteps,
        pagination: getPagination(action, allSteps.length),
      };
    case REQUESTS.GET_CHALLENGES_BY_FILTER.SUCCESS:
      const {
        receiver_ids: personId,
        organization_ids: orgId,
      } = action.query.filters;
      return {
        ...state,
        contactSteps: {
          ...state.contactSteps,
          [`${personId}-${orgId}`]: action.results.response,
        },
      };
    case TOGGLE_STEP_FOCUS:
      return {
        ...state,
        mine: toggleStepReminder(state.mine, action.step),
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
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

const toggleStepReminder = (steps, step) =>
  steps.map(s => ({
    ...s,
    focus: s.id === step.id ? !s.focus : s.focus,
  }));
