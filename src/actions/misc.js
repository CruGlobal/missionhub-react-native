/* eslint max-params: 0, max-lines-per-function: 0 */

import { Linking } from 'react-native';

import { contactAssignmentSelector } from '../selectors/people';
import {
  SELECT_MY_STAGE_FLOW,
  SELECT_PERSON_STAGE_FLOW,
} from '../routes/constants';

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
        contactId: resultPerson.id,
        orgId,
        contactAssignmentId: contactAssignment.id,
        firstName: resultPerson.first_name,
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
  noNav = false,
) {
  return dispatch => {
    if (personIsCurrentUser) {
      dispatch(
        navigatePush(SELECT_MY_STAGE_FLOW, {
          firstItem: firstItemIndex,
          contactId: person.id,
          section: 'people',
          subsection: 'self',
          enableBackButton: true,
          noNav,
        }),
      );
    } else {
      dispatch(
        navigatePush(SELECT_PERSON_STAGE_FLOW, {
          firstItem: firstItemIndex,
          name: person.first_name,
          contactId: person.id,
          contactAssignmentId: contactAssignment && contactAssignment.id,
          orgId: organization.id,
          section: 'people',
          subsection: 'person',
          noNav,
        }),
      );
    }
  };
}
