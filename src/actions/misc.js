import { Linking } from 'react-native';

import { trackActionWithoutData } from '../actions/analytics';
import { getContactSteps } from '../actions/steps';
import { reloadJourney } from '../actions/journey';

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
