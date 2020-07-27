import i18next from 'i18next';
import * as RNOmniture from 'react-native-omniture';
import { ThunkDispatch } from 'redux-thunk';
import appsFlyer from 'react-native-appsflyer';
import { AnyAction } from 'redux';

import { LOAD_PERSON_DETAILS } from '../../constants';
import { getFeatureFlags } from '../misc';
import { getMe } from '../person';
import { getMyPeople } from '../people';
import { getStagesIfNotExists } from '../stages';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { getMyCommunities } from '../organizations';
import { logInAnalytics } from '../analytics';
import { rollbar } from '../../utils/rollbar.config';
import { requestNativePermissions } from '../notifications';
import { isAndroid } from '../../utils/common';
import { RootState } from '../../reducers';

function getTimezoneString() {
  return `${(new Date().getTimezoneOffset() / 60) * -1}`;
}

export function updateLocaleAndTimezone() {
  return (
    dispatch: ThunkDispatch<RootState, never, AnyAction>,
    getState: () => RootState,
  ) => {
    const {
      person: { user },
    } = getState().auth;
    const timezone = getTimezoneString();
    const language = i18next.language;
    if (user.timezone !== timezone || user.mobile_language !== language) {
      const data = {
        data: {
          attributes: {
            timezone,
            mobile_language: language,
          },
        },
      };
      return dispatch(callApi(REQUESTS.UPDATE_ME_USER, {}, data));
    }
  };
}

export function authSuccess() {
  return async (
    dispatch: ThunkDispatch<RootState, null, AnyAction>,
    getState: () => RootState,
  ) => {
    dispatch(logInAnalytics());

    const {
      person: { id: personId },
    } = getState().auth;
    rollbar.setPerson(personId);

    const mePerson = await dispatch(getMe('contact_assignments'));
    RNOmniture.syncIdentifier(mePerson.global_registry_mdm_id);
    appsFlyer.setCustomerUserId(mePerson.global_registry_mdm_id, () => {});

    getFeatureFlags();
    dispatch({
      type: LOAD_PERSON_DETAILS,
      person: mePerson,
    });

    isAndroid && dispatch(requestNativePermissions());
  };
}

export function loadHome() {
  return (
    dispatch: ThunkDispatch<RootState, never, AnyAction>,
    getState: () => RootState,
  ) => {
    // Don't try to run all these things if there is no token
    if (!getState().auth.token) {
      return Promise.resolve();
    }
    // TODO: Set this up so it only loads these if it hasn't loaded them in X amount of time
    dispatch(getMe());
    dispatch(getMyPeople());
    dispatch(getMyCommunities());
    dispatch(getStagesIfNotExists());
    dispatch(updateLocaleAndTimezone());
  };
}
