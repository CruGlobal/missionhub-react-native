import i18next from 'i18next';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { getMe } from '../person';
import { getMyPeople } from '../people';
import { getStagesIfNotExists } from '../stages';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { getMyCommunities } from '../organizations';
import { RootState } from '../../reducers';
import { isAuthenticated } from '../../auth/authStore';
import { apolloClient } from '../../apolloClient';

import { LOCALE_AND_TIMEZONE_QUERY } from './queries';
import { LocaleAndTimezone } from './__generated__/LocaleAndTimezone';

function getTimezoneString() {
  return `${(new Date().getTimezoneOffset() / 60) * -1}`;
}

export function updateLocaleAndTimezone() {
  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    const { data } = await apolloClient.query<LocaleAndTimezone>({
      query: LOCALE_AND_TIMEZONE_QUERY,
    });
    const timezone = getTimezoneString();
    const language = i18next.language;
    if (
      data.currentUser.timezone !== timezone ||
      data.currentUser.mobileLanguage !== language
    ) {
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

export function loadHome() {
  return (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    // Don't try to run all these things if there is no token
    if (!isAuthenticated()) {
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
