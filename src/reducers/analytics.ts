import i18next from 'i18next';

import {
  ANALYTICS_CONTEXT_CHANGED,
  ANALYTICS_MCID,
  ANALYTICS_PREVIOUS_SCREEN_NAME,
  ANALYTICS_APP_NAME,
  ANALYTICS_LOGGED_IN_STATUS,
  ANALYTICS_SSO_GUID,
  ANALYTICS_GR_MASTER_PERSON_ID,
  ANALYTICS_CONTENT_LANGUAGE,
  ANALYTICS_MINISTRY_MODE,
  NOT_LOGGED_IN,
  LOGOUT,
  RELOAD_APP,
  ANALYTICS_FACEBOOK_ID,
} from '../constants';
import { REQUESTS } from '../api/routes';
import { TrackStateContext } from '../actions/analytics';

export interface AnalyticsState {
  [ANALYTICS_MCID]: TrackStateContext['cru.mcid'];
  [ANALYTICS_PREVIOUS_SCREEN_NAME]: TrackStateContext['cru.previousscreenname'];
  [ANALYTICS_APP_NAME]: TrackStateContext['cru.appname'];
  [ANALYTICS_LOGGED_IN_STATUS]: TrackStateContext['cru.loggedinstatus'];
  [ANALYTICS_SSO_GUID]: TrackStateContext['cru.ssoguid'];
  [ANALYTICS_GR_MASTER_PERSON_ID]: TrackStateContext['cru.grmasterpersonid'];
  [ANALYTICS_FACEBOOK_ID]: TrackStateContext['cru.facebookid'];
  [ANALYTICS_CONTENT_LANGUAGE]: TrackStateContext['cru.contentlanguage'];
  [ANALYTICS_MINISTRY_MODE]: TrackStateContext['cru.ministry-mode'];
}

export const initialAnalyticsState: AnalyticsState = {
  [ANALYTICS_MCID]: '',
  [ANALYTICS_PREVIOUS_SCREEN_NAME]: '',
  [ANALYTICS_APP_NAME]: 'MissionHub App',
  [ANALYTICS_LOGGED_IN_STATUS]: NOT_LOGGED_IN,
  [ANALYTICS_SSO_GUID]: '',
  [ANALYTICS_GR_MASTER_PERSON_ID]: '',
  [ANALYTICS_FACEBOOK_ID]: '',
  [ANALYTICS_CONTENT_LANGUAGE]: i18next.language,
  [ANALYTICS_MINISTRY_MODE]: false,
};

interface AnalyticsContextChangedAction {
  type: typeof ANALYTICS_CONTEXT_CHANGED;
  analyticsContext: Partial<AnalyticsAction>;
}

interface KeyLoginSuccessAction {
  type: typeof REQUESTS.KEY_LOGIN.SUCCESS;
  results: { thekey_guid: string };
}

type AnalyticsAction =
  | AnalyticsContextChangedAction
  | KeyLoginSuccessAction
  | { type: typeof RELOAD_APP }
  | { type: typeof LOGOUT };

function analyticsReducer(
  state = initialAnalyticsState,
  action: AnalyticsAction,
) {
  switch (action.type) {
    case ANALYTICS_CONTEXT_CHANGED:
      return {
        ...state,
        ...(action.analyticsContext as AnalyticsState),
      };
    case REQUESTS.KEY_LOGIN.SUCCESS:
      return {
        ...state,
        [ANALYTICS_SSO_GUID]: action.results.thekey_guid,
      };
    case RELOAD_APP:
      return {
        ...state,
        [ANALYTICS_PREVIOUS_SCREEN_NAME]: '',
      };
    case LOGOUT:
      return {
        ...state,
        [ANALYTICS_LOGGED_IN_STATUS]: NOT_LOGGED_IN,
        [ANALYTICS_SSO_GUID]: '',
        [ANALYTICS_GR_MASTER_PERSON_ID]: '',
        [ANALYTICS_FACEBOOK_ID]: '',
        [ANALYTICS_MINISTRY_MODE]: false,
      };
    default:
      return state;
  }
}

export default analyticsReducer;
