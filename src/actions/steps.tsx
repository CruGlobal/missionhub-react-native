/* eslint complexity: 0, max-lines: 0, max-lines-per-function: 0 */

import i18next from 'i18next';
import { ThunkDispatch } from 'redux-thunk';

import {
  COMPLETED_STEP_COUNT,
  STEP_NOTE,
  ACTIONS,
  ACCEPTED_STEP,
} from '../constants';
import { formatApiDate, isCustomStep } from '../utils/common';
import { buildCustomStep } from '../utils/steps';
import {
  COMPLETE_STEP_FLOW,
  COMPLETE_STEP_FLOW_NAVIGATE_BACK,
} from '../routes/constants';
import { REQUESTS } from '../api/routes';
import { AuthState } from '../reducers/auth';
import { apolloClient } from '../apolloClient';
import { STEPS_QUERY } from '../containers/StepsScreen';
import { StepsList } from '../containers/StepsScreen/__generated__/StepsList';

import { refreshImpact } from './impact';
import { navigatePush } from './navigation';
import callApi from './api';
import { trackAction, trackStepAdded } from './analytics';
import { reloadGroupCelebrateFeed } from './celebration';

export function getStepSuggestions(isMe: boolean, contactStageId: string) {
  return (dispatch: ThunkDispatch<never, never, never>) => {
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

export function getContactSteps(personId: string, orgId?: string) {
  return (dispatch: ThunkDispatch<never, never, never>) => {
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

export function addStep(
  stepSuggestion: { id?: string; body: string; challenge_type?: string },
  personId: string,
  orgId?: string,
) {
  return async (dispatch: ThunkDispatch<never, never, never>) => {
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
    apolloClient.query<StepsList>({ query: STEPS_QUERY });
    dispatch(getContactSteps(personId, orgId));
  };
}

export function createCustomStep(
  stepText: string,
  personId: string,
  orgId?: string,
) {
  return (
    dispatch: ThunkDispatch<never, never, never>,
    getState: () => { auth: AuthState },
  ) => {
    const {
      auth: {
        person: { id: myId },
      },
    } = getState();
    const isMe = personId === myId;

    dispatch(addStep(buildCustomStep(stepText, isMe), personId, orgId));
  };
}

export function updateChallengeNote(stepId: string, note: string) {
  return (dispatch: ThunkDispatch<never, never, never>) => {
    const query = { challenge_id: stepId };
    const data = buildChallengeData({ note });

    return dispatch(callApi(REQUESTS.CHALLENGE_COMPLETE, query, data));
  };
}

function buildChallengeData(attributes: object) {
  return {
    data: {
      type: ACCEPTED_STEP,
      attributes,
    },
  };
}

function completeChallengeAPI(step: {
  id: string;
  receiver: { id: string };
  organization?: { id: string };
}) {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (dispatch: ThunkDispatch<never, never, any>) => {
    const { id: stepId, receiver, organization } = step;
    const receiverId = receiver && receiver.id;
    const orgId = organization && organization.id;

    const query = {
      challenge_id: stepId,
    };
    const data = buildChallengeData({
      completed_at: formatApiDate(),
    });

    await dispatch(callApi(REQUESTS.CHALLENGE_COMPLETE, query, data));
    dispatch({
      type: COMPLETED_STEP_COUNT,
      userId: receiverId,
    });
    dispatch(refreshImpact(orgId));

    removeFromStepsList(stepId);
    dispatch(getContactSteps(receiverId, orgId));

    if (orgId) {
      dispatch(reloadGroupCelebrateFeed(orgId));
    }
  };
}

export function completeStep(
  step: {
    id: string;
    receiver: { id: string };
    organization?: { id: string };
  },
  screen: string,
  extraBack = false,
) {
  return (dispatch: ThunkDispatch<never, never, never>) => {
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

export function deleteStepWithTracking(step: { id: string }, screen: string) {
  return async (dispatch: ThunkDispatch<never, never, never>) => {
    await dispatch(deleteStep(step));
    dispatch(
      trackAction(`${ACTIONS.STEP_REMOVED.name} on ${screen} Screen`, {
        [ACTIONS.STEP_REMOVED.key]: null,
      }),
    );
  };
}

function deleteStep(step: { id: string }) {
  return async (dispatch: ThunkDispatch<never, never, never>) => {
    const query = { challenge_id: step.id };
    await dispatch(callApi(REQUESTS.DELETE_CHALLENGE, query, {}));
    removeFromStepsList(step.id);
  };
}

const removeFromStepsList = (stepId: string) => {
  const cachedSteps = apolloClient.readQuery<StepsList>({
    query: STEPS_QUERY,
  });
  cachedSteps &&
    apolloClient.writeQuery<StepsList>({
      query: STEPS_QUERY,
      data: {
        ...cachedSteps,
        steps: {
          ...cachedSteps.steps,
          nodes: cachedSteps.steps.nodes.filter(({ id }) => id !== stepId),
        },
      },
    });
};
