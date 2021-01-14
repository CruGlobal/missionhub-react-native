import { ThunkDispatch } from 'redux-thunk';
import appsFlyer from 'react-native-appsflyer';
import { AnyAction } from 'redux';

import { STEP_NOTE, ACTIONS, ACCEPTED_STEP } from '../constants';
import {
  COMPLETE_STEP_FLOW,
  COMPLETE_STEP_FLOW_NAVIGATE_BACK,
} from '../routes/constants';
import { REQUESTS } from '../api/routes';
import { apolloClient } from '../apolloClient';
import { STEPS_QUERY } from '../containers/StepsScreen/queries';
import { StepsList } from '../containers/StepsScreen/__generated__/StepsList';
import { PERSON_STEPS_QUERY } from '../containers/PersonScreen/PersonSteps/queries';
import {
  PersonStepsList,
  PersonStepsListVariables,
} from '../containers/PersonScreen/PersonSteps/__generated__/PersonStepsList';
import { RootState } from '../reducers';

import { refreshImpact } from './impact';
import { navigatePush } from './navigation';
import callApi from './api';
import { trackAction } from './analytics';
import { getCelebrateFeed } from './celebration';

export function updateChallengeNote(stepId: string, note: string) {
  return (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    if (!stepId) {
      return;
    }

    const query = { challenge_id: stepId };
    const data = buildChallengeData({ note });

    return dispatch(callApi(REQUESTS.CHALLENGE_COMPLETE, query, data));
  };
}

function buildChallengeData(attributes: Record<string, unknown>) {
  return {
    data: {
      type: ACCEPTED_STEP,
      attributes,
    },
  };
}

export function handleAfterCompleteStep(
  step: {
    id: string;
    receiver: { id: string };
    community?: { id: string } | null;
  },
  screen: string,
  extraBack = false,
) {
  return (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    const { id: stepId, receiver, community } = step;
    const receiverId = receiver && receiver.id;
    const communityId = (community && community.id) || undefined;

    dispatch(
      navigatePush(
        extraBack ? COMPLETE_STEP_FLOW_NAVIGATE_BACK : COMPLETE_STEP_FLOW,
        {
          id: stepId,
          personId: receiverId,
          orgId: communityId,
          onSetComplete: () => {
            dispatch(refreshImpact(communityId));

            removeFromStepsList(stepId, receiverId);

            apolloClient.query({
              query: PERSON_STEPS_QUERY,
              variables: { personId: receiverId, completed: true },
            });

            communityId && getCelebrateFeed(communityId);
          },
          type: STEP_NOTE,
        },
      ),
    );

    dispatch(
      trackAction(`${ACTIONS.STEP_COMPLETED.name} on ${screen} Screen`, {
        [ACTIONS.STEP_COMPLETED.key]: null,
      }),
    );
    appsFlyer.logEvent(ACTIONS.STEP_COMPLETED.name, ACTIONS.STEP_COMPLETED);
  };
}

export const removeFromStepsList = (stepId: string, personId: string) => {
  try {
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
  } catch {
    // This can fail if the query hasn't been run yet. We don't care about errors, there's nothing to remove if the query isn't cached.
  }

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
