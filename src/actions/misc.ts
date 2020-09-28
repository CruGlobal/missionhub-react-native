import gql from 'graphql-tag';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import {
  SELECT_MY_STAGE_FLOW,
  SELECT_PERSON_STAGE_FLOW,
  ADD_MY_STEP_FLOW,
  ADD_PERSON_STEP_FLOW,
} from '../routes/constants';
import { apolloClient } from '../apolloClient';
import { RootState } from '../reducers';
import { getAuthPerson } from '../auth/authUtilities';

import { navigatePush } from './navigation';
import { GetFeatureFlags } from './__generated__/GetFeatureFlags';

export const GET_FEATURE_FLAGS = gql`
  query GetFeatureFlags {
    features
  }
`;

export function getFeatureFlags() {
  apolloClient.query<GetFeatureFlags>({
    query: GET_FEATURE_FLAGS,
  });
}

export const navigateToStageScreen = (
  personId: string,
  firstItemIndex?: number, //todo find a way to not pass this
  skipSelectSteps = false,
) => (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
  const isMe = getAuthPerson().id === personId;

  if (isMe) {
    dispatch(
      navigatePush(SELECT_MY_STAGE_FLOW, {
        selectedStageId: firstItemIndex,
        personId,
      }),
    );
  } else {
    dispatch(
      navigatePush(SELECT_PERSON_STAGE_FLOW, {
        skipSelectSteps,
        selectedStageId: firstItemIndex,
        personId,
      }),
    );
  }
};
export const navigateToAddStepFlow = (personId: string) => (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
) => {
  const isMe = getAuthPerson().id === personId;

  if (isMe) {
    dispatch(navigatePush(ADD_MY_STEP_FLOW, { personId }));
  } else {
    dispatch(navigatePush(ADD_PERSON_STEP_FLOW, { personId }));
  }
};
