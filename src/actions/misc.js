import { Linking } from 'react-native';

import { trackActionWithoutData } from './analytics';
import { getContactSteps } from './steps';
import { reloadJourney } from './journey';
import { createContactAssignment } from './person';
import { contactAssignmentSelector } from '../selectors/people';
import { navigatePush } from './navigation';
import { PERSON_STAGE_SCREEN } from '../containers/PersonStageScreen';

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
        orgId: orgId,
        contactAssignmentId,
        name: resultPerson.first_name,
        onComplete: () => {},
        section: 'people',
        subsection: 'person',
      }),
    );
  };
}
