/* eslint-disable @typescript-eslint/no-explicit-any */

import i18next from 'i18next';
import * as RNOmniture from 'react-native-omniture';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { LOAD_PERSON_DETAILS } from '../../constants';
import { getMe } from '../person';
import { getMyPeople } from '../people';
import { getStagesIfNotExists } from '../stages';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { getMyCommunities } from '../organizations';
import { logInAnalytics } from '../analytics';
import { rollbar } from '../../utils/rollbar.config';
import { AuthState } from '../../reducers/auth';

function getTimezoneString() {
  return `${(new Date().getTimezoneOffset() / 60) * -1}`;
}

export function updateLocaleAndTimezone() {
  return (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    getState: () => { auth: AuthState },
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
      return dispatch<any>(callApi(REQUESTS.UPDATE_ME_USER, {}, data));
    }
  };
}

export function authSuccess() {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    getState: () => { auth: AuthState },
  ) => {
    dispatch<any>(logInAnalytics());

    const {
      person: { id: personId },
    } = getState().auth;
    rollbar.setPerson(personId);

    const mePerson = await dispatch(getMe('contact_assignments'));
    RNOmniture.syncIdentifier(mePerson.global_registry_mdm_id);

    dispatch({
      type: LOAD_PERSON_DETAILS,
      person: mePerson,
    });
  };
}

export function loadHome() {
  return (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    getState: () => { auth: AuthState },
  ) => {
    // Don't try to run all these things if there is no token
    if (!getState().auth.token) {
      return Promise.resolve();
    }
    // TODO: Set this up so it only loads these if it hasn't loaded them in X amount of time
    //@ts-ignore
    dispatch(getMe());
    dispatch(getMyPeople());
    dispatch(getMyCommunities());
    dispatch<any>(getStagesIfNotExists());
    dispatch<any>(updateLocaleAndTimezone());
  };
}
