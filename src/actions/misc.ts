/* eslint max-params: 0, max-lines-per-function: 0 */

import { Linking } from 'react-native';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { contactAssignmentSelector } from '../selectors/people';
import {
  SELECT_MY_STAGE_FLOW,
  SELECT_PERSON_STAGE_FLOW,
  ADD_MY_STEP_FLOW,
  ADD_PERSON_STEP_FLOW,
} from '../routes/constants';
import { WARN } from '../utils/logging';
import { AuthState } from '../reducers/auth';

import { trackActionWithoutData, setAnalyticsSelfOrContact } from './analytics';
import { getContactSteps } from './steps';
import { reloadJourney } from './journey';
import { createContactAssignment, getPersonScreenRoute } from './person';
import { navigatePush, navigateReplace } from './navigation';

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

// @ts-ignore
export function loadStepsAndJourney(personId, organizationId) {
  // @ts-ignore
  return dispatch => {
    dispatch(getContactSteps(personId, organizationId));
    dispatch(reloadJourney(personId, organizationId));
  };
}

export const assignContactAndPickStage = (
  person: { id: string },
  organization: { id: string },
) => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
  getState: () => { auth: AuthState },
) => {
  const auth = getState().auth;
  const authPerson = auth.person;
  const myId = auth.person.id;
  const orgId = organization.id;
  const personId = person.id;

  const { person: resultPerson } = await dispatch(
    createContactAssignment(orgId, myId, personId),
  );

  const contactAssignment = contactAssignmentSelector(
    { auth },
    { person: resultPerson, orgId },
  );

  dispatch(
    navigateReplace(
      getPersonScreenRoute(
        authPerson,
        resultPerson,
        organization,
        contactAssignment,
      ),
      {
        person: resultPerson,
        organization,
      },
    ),
  );

  dispatch(setAnalyticsSelfOrContact('contact'));
  dispatch(
    navigatePush(SELECT_PERSON_STAGE_FLOW, {
      personId: resultPerson.id,
      orgId,
    }),
  );
};

export const navigateToStageScreen = (
  personIsCurrentUser: boolean,
  person: { id: string },
  organization: { id: string },
  firstItemIndex: number | null, //todo find a way to not pass this
) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  if (personIsCurrentUser) {
    dispatch(setAnalyticsSelfOrContact('self'));
    dispatch(
      navigatePush(SELECT_MY_STAGE_FLOW, {
        selectedStageId: firstItemIndex,
        personId: person.id,
      }),
    );
  } else {
    dispatch(setAnalyticsSelfOrContact('contact'));
    dispatch(
      navigatePush(SELECT_PERSON_STAGE_FLOW, {
        selectedStageId: firstItemIndex,
        personId: person.id,
        orgId: organization.id,
      }),
    );
  }
};

export const navigateToAddStepFlow = (
  personIsCurrentUser: boolean,
  person: { id: string; first_name: string },
  organization: { id: string },
) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  if (personIsCurrentUser) {
    dispatch(setAnalyticsSelfOrContact('self'));
    dispatch(navigatePush(ADD_MY_STEP_FLOW));
  } else {
    dispatch(setAnalyticsSelfOrContact('contact'));
    dispatch(
      navigatePush(ADD_PERSON_STEP_FLOW, {
        contactName: person.first_name,
        personId: person.id,
        orgId: organization.id,
      }),
    );
  }
};
