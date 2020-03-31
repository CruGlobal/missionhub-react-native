import { ThunkDispatch } from 'redux-thunk';

import {
  COMPLETED_STEP_COUNT,
  STEP_NOTE,
  ACTIONS,
  ACCEPTED_STEP,
} from '../constants';
import { formatApiDate } from '../utils/common';
import {
  COMPLETE_STEP_FLOW,
  COMPLETE_STEP_FLOW_NAVIGATE_BACK,
} from '../routes/constants';
import { REQUESTS } from '../api/routes';
import { apolloClient } from '../apolloClient';
import { STEPS_QUERY } from '../containers/StepsScreen/queries';
import { StepsList } from '../containers/StepsScreen/__generated__/StepsList';
import { PERSON_STEPS_QUERY } from '../containers/ContactSteps/queries';
import {
  PersonStepsList,
  PersonStepsListVariables,
} from '../containers/ContactSteps/__generated__/PersonStepsList';

import { refreshImpact } from './impact';
import { navigatePush } from './navigation';
import callApi from './api';
import { trackAction } from './analytics';
import { getCelebrateFeed } from './celebration';

export function updateChallengeNote(stepId: string, note: string) {
  return (dispatch: ThunkDispatch<never, never, never>) => {
    if (!stepId) {
      return;
    }

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

    removeFromStepsList(stepId, receiverId);

    orgId && getCelebrateFeed(orgId);
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

export function deleteStepWithTracking(
  step: { id: string; receiver: { id: string } },
  screen: string,
) {
  return async (dispatch: ThunkDispatch<never, never, never>) => {
    await dispatch(deleteStep(step));
    dispatch(
      trackAction(`${ACTIONS.STEP_REMOVED.name} on ${screen} Screen`, {
        [ACTIONS.STEP_REMOVED.key]: null,
      }),
    );
  };
}

function deleteStep(step: { id: string; receiver: { id: string } }) {
  return async (dispatch: ThunkDispatch<never, never, never>) => {
    const query = { challenge_id: step.id };
    await dispatch(callApi(REQUESTS.DELETE_CHALLENGE, query, {}));
    removeFromStepsList(step.id, step.receiver.id);
  };
}

const removeFromStepsList = (stepId: string, personId: string) => {
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

  try {
    const personStepsVariables = { personId, completed: false };

    const cachedPersonSteps = apolloClient.readQuery<
      PersonStepsList,
      PersonStepsListVariables
    >({
      query: PERSON_STEPS_QUERY,
      variables: personStepsVariables,
    });

    cachedPersonSteps &&
      apolloClient.writeQuery<PersonStepsList, PersonStepsListVariables>({
        query: PERSON_STEPS_QUERY,
        variables: personStepsVariables,
        data: {
          ...cachedPersonSteps,
          person: {
            ...cachedPersonSteps.person,
            steps: {
              ...cachedPersonSteps.person.steps,
              nodes: cachedPersonSteps.person.steps.nodes.filter(
                ({ id }) => id !== stepId,
              ),
            },
          },
        },
      });
  } catch {
    // This can fail if the query hasn't been run yet. We don't care about errors, there's nothing to remove if the query isn't cached.
  }
};
