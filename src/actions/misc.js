import { Linking } from 'react-native';

import { contactAssignmentSelector } from '../selectors/people';
import { PERSON_STAGE_SCREEN } from '../containers/PersonStageScreen';
import { STAGE_SCREEN } from '../containers/StageScreen';

import { trackActionWithoutData } from './analytics';
import { getContactSteps } from './steps';
import { reloadJourney } from './journey';
import {
  createContactAssignment,
  updatePersonAttributes,
  getPersonDetails,
} from './person';
import { navigatePush } from './navigation';

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
            if (url.includes('telprompt')) {
              // telprompt was cancelled and Linking openURL method sees this as an error
              // it is not a true error so ignore it to prevent apps crashing
            } else {
              WARN('openURL error', err);
            }
          });
      })
      .catch(err => WARN('An unexpected error happened', err));
}

export function loadStepsAndJourney({ id: personId }, { id: organizationId }) {
  return dispatch => {
    dispatch(getContactSteps(personId, organizationId));
    dispatch(reloadJourney(personId, organizationId));
  };
}

export function assignContactAndPickStage(personId, orgId, myId) {
  return async dispatch => {
    const { person: resultPerson } = await dispatch(
      createContactAssignment(orgId, myId, personId),
    );

    const { id: contactAssignmentId } = contactAssignmentSelector(
      { auth: { person: { id: myId } } },
      { person: resultPerson, orgId },
    );

    dispatch(
      navigatePush(PERSON_STAGE_SCREEN, {
        contactId: resultPerson.id,
        orgId,
        contactAssignmentId,
        name: resultPerson.first_name,
        onComplete: () => {},
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
  onComplete = null,
) {
  return async dispatch => {
    if (personIsCurrentUser) {
      dispatch(
        navigatePush(STAGE_SCREEN, {
          onComplete: stage => {
            dispatch(
              updatePersonAttributes(person.id, {
                user: { pathway_stage_id: stage.id },
              }),
            );
            dispatch(loadStepsAndJourney(person, organization));
            onComplete && onComplete(stage);
          },
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
        navigatePush(PERSON_STAGE_SCREEN, {
          onComplete: stage => {
            contactAssignment
              ? dispatch(
                  updatePersonAttributes(person.id, {
                    reverse_contact_assignments: person.reverse_contact_assignments.map(
                      assignment =>
                        assignment.id === contactAssignment.id
                          ? { ...assignment, pathway_stage_id: stage.id }
                          : assignment,
                    ),
                  }),
                )
              : dispatch(getPersonDetails(person.id, organization.id));
            dispatch(loadStepsAndJourney(person, organization));
            onComplete && onComplete(stage);
          },
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
