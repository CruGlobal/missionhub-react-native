import i18next from 'i18next';
import * as RNOmniture from 'react-native-omniture';

import {
  NOTIFICATION_PROMPT_TYPES,
  LOAD_PERSON_DETAILS,
} from '../../constants';
import { getMe } from '../person';
import { getMyPeople } from '../people';
import { showReminderOnLoad } from '../notifications';
import { getStagesIfNotExists } from '../stages';
import { getMySteps } from '../steps';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { getMyCommunities } from '../organizations';
import { logInAnalytics } from '../analytics';
import { rollbar } from '../../utils/rollbar.config';

function getTimezoneString() {
  return `${(new Date().getTimezoneOffset() / 60) * -1}`;
}

export function updateLocaleAndTimezone() {
  return (dispatch, getState) => {
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
  return async (dispatch, getState) => {
    dispatch(logInAnalytics());

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
  return async (dispatch, getState) => {
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
    await dispatch(getMySteps());
    dispatch(showReminderOnLoad(NOTIFICATION_PROMPT_TYPES.LOGIN));
  };
}
