import { Linking } from 'react-native';
import gql from 'graphql-tag';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import {
  SELECT_MY_STAGE_FLOW,
  SELECT_PERSON_STAGE_FLOW,
  ADD_MY_STEP_FLOW,
  ADD_PERSON_STEP_FLOW,
} from '../routes/constants';
import { WARN } from '../utils/logging';
import { apolloClient } from '../apolloClient';
import { RootState } from '../reducers';
import { getAuthPerson } from '../auth/authUtilities';

import { trackActionWithoutData } from './analytics';
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

// @ts-ignore
export function openCommunicationLink(url, action) {
  //if someone has a better name for this feel free to suggest.
  // @ts-ignore
  return dispatch =>
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          WARN("Can't handle url: ", url);
          return;
        }

        Linking.openURL(url)
          .then(() => {
            dispatch(trackActionWithoutData(action));
          })
          .catch(err => {
            if ((url || '').includes('telprompt')) {
              // telprompt was cancelled and Linking openURL method sees this as an error
              // it is not a true error so ignore it to prevent apps crashing
            } else {
              WARN('openURL error', err);
            }
          });
      })
      .catch(err => WARN('An unexpected error happened', err));
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
