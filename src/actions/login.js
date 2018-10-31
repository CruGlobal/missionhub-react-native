import { Crashlytics } from 'react-native-fabric';
import * as RNOmniture from 'react-native-omniture';

import { getMe } from './person';
import { logInAnalytics } from './analytics';

export function onSuccessfulLogin() {
  return async (dispatch, getState) => {
    dispatch(logInAnalytics());

    const {
      person: { id: personId },
    } = getState().auth;
    Crashlytics.setUserIdentifier(personId);

    const mePerson = await dispatch(getMe('contact_assignments'));
    RNOmniture.syncIdentifier(mePerson.global_registry_mdm_id);

    return mePerson;
  };
}
