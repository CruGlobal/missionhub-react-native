/* eslint complexity: 0, max-lines-per-function: 0 */
import { AnyAction } from 'redux';

import { REQUESTS } from '../api/routes';
import { LOGOUT, COMPLETED_STEP_COUNT, RESET_STEP_COUNT } from '../constants';
import { shuffleArray } from '../utils/common';

import { Person } from './people';
import { Organization } from './organizations';
import { Stage } from './stages';

export type SuggestedStep = {
  id: string;
  body: string;
  description_markdown?: string;
  challenge_type: string;
  self_step: boolean;
  locale: string;
  pathway_stage: Stage;
};

export type Step = {
  id: string;
  challenge_suggestion?: SuggestedStep;
  completed_at: Date;
  organization: Organization | null;
  receiver: Person;
  title: string;
  type: string;
};

export interface StepsState {
  suggestedForMe: { [key: string]: Step[] };
  suggestedForOthers: { [key: string]: Step[] };
  userStepCount: { [key: string]: number };
  contactSteps: {
    [key: string]: {
      steps: Step[];
      completedSteps: Step[];
    };
  };
}

export const initialState: StepsState = {
  suggestedForMe: {},
  suggestedForOthers: {},
  userStepCount: {},
  contactSteps: {},
};

export default function stepsReducer(state = initialState, action: AnyAction) {
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
            steps: allStepsFilter.filter((step: Step) => !step.completed_at),
            completedSteps: sortByCompleted(
              allStepsFilter.filter((step: Step) => step.completed_at),
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

      const removeStepById = (stepId: string, steps: Step[]) =>
        steps.filter(({ id }) => id !== stepId);

      return {
        ...state,
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

function sortByCompleted(arr: Step[]) {
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
