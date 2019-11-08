/* eslint max-params: 0, max-lines-per-function: 0 */

import { Linking } from 'react-native';

import { contactAssignmentSelector } from '../selectors/people';
import {
  SELECT_MY_STAGE_FLOW,
  SELECT_PERSON_STAGE_FLOW,
  ADD_MY_STEP_FLOW,
  ADD_PERSON_STEP_FLOW,
} from '../routes/constants';
import { WARN } from '../utils/logging';
import { buildTrackingObj } from '../utils/common';

import { trackActionWithoutData } from './analytics';
import { getContactSteps } from './steps';
import { reloadJourney } from './journey';
import { createContactAssignment, getPersonScreenRoute } from './person';
import { navigatePush, navigateReplace } from './navigation';

export function openCommunicationLink(url, action) {
  //if someone has a better name for this feel free to suggest.
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

export function loadStepsAndJourney(personId, organizationId) {
  return dispatch => {
    dispatch(getContactSteps(personId, organizationId));
    dispatch(reloadJourney(personId, organizationId));
  };
}

export function assignContactAndPickStage(person, organization) {
  return async (dispatch, getState) => {
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

    dispatch(
      navigatePush(SELECT_PERSON_STAGE_FLOW, {
        personId: resultPerson.id,
        orgId,
        section: 'people',
        subsection: 'person',
      }),
    );
  };
}

export function navigateToStageScreen(
  personIsCurrentUser,
  person,
  contactAssignment,
  organization = {},
  firstItemIndex, //todo find a way to not pass this
) {
  return dispatch => {
    if (personIsCurrentUser) {
      dispatch(
        navigatePush(SELECT_MY_STAGE_FLOW, {
          selectedStageId: firstItemIndex,
          personId: person.id,
          section: 'people',
          subsection: 'self',
        }),
      );
    } else {
      dispatch(
        navigatePush(SELECT_PERSON_STAGE_FLOW, {
          selectedStageId: firstItemIndex,
          personId: person.id,
          orgId: organization.id,
          section: 'people',
          subsection: 'person',
        }),
      );
    }
  };
}

export function navigateToAddStepFlow(
  personIsCurrentUser,
  person,
  organization,
) {
  return dispatch => {
    const trackingParams = {
      trackingObj: buildTrackingObj(
        'people : person : steps : add',
        'people',
        'person',
        'steps',
      ),
    };

    if (personIsCurrentUser) {
      dispatch(
        navigatePush(ADD_MY_STEP_FLOW, {
          ...trackingParams,
          organization,
        }),
      );
    } else {
      dispatch(
        navigatePush(ADD_PERSON_STEP_FLOW, {
          ...trackingParams,
          contactName: person.first_name,
          personId: person.id,
          organization,
          createStepTracking: buildTrackingObj(
            'people : person : steps : create',
            'people',
            'person',
            'steps',
          ),
        }),
      );
    }
  };
}
