import i18next from 'i18next';

import {
  ANALYTICS_MCID,
  ANALYTICS_PREVIOUS_SCREEN_NAME,
  ANALYTICS_APP_NAME,
  ANALYTICS_LOGGED_IN_STATUS,
  ANALYTICS_SSO_GUID,
  ANALYTICS_GR_MASTER_PERSON_ID,
  ANALYTICS_FACEBOOK_ID,
  ANALYTICS_CONTENT_LANGUAGE,
  ANALYTICS_MINISTRY_MODE,
  NOT_LOGGED_IN,
  LOGOUT,
  RELOAD_APP,
} from '../constants';
import { REQUESTS } from '../api/routes';
import {
  TrackStateContext,
  ANALYTICS_CONTEXT_CHANGED,
} from '../actions/analytics';

export interface AnalyticsState {
  [ANALYTICS_MCID]: TrackStateContext[typeof ANALYTICS_MCID];
  [ANALYTICS_PREVIOUS_SCREEN_NAME]: TrackStateContext[typeof ANALYTICS_PREVIOUS_SCREEN_NAME];
  [ANALYTICS_APP_NAME]: TrackStateContext[typeof ANALYTICS_APP_NAME];
  [ANALYTICS_LOGGED_IN_STATUS]: TrackStateContext[typeof ANALYTICS_LOGGED_IN_STATUS];
  [ANALYTICS_SSO_GUID]: TrackStateContext[typeof ANALYTICS_SSO_GUID];
  [ANALYTICS_GR_MASTER_PERSON_ID]: TrackStateContext[typeof ANALYTICS_GR_MASTER_PERSON_ID];
  [ANALYTICS_FACEBOOK_ID]: TrackStateContext[typeof ANALYTICS_FACEBOOK_ID];
  [ANALYTICS_CONTENT_LANGUAGE]: TrackStateContext[typeof ANALYTICS_CONTENT_LANGUAGE];
  [ANALYTICS_MINISTRY_MODE]: TrackStateContext[typeof ANALYTICS_MINISTRY_MODE];
}

export const initialAnalyticsState = {
  [ANALYTICS_MCID]: '',
  [ANALYTICS_PREVIOUS_SCREEN_NAME]: '',
  [ANALYTICS_APP_NAME]: 'MissionHub App' as TrackStateContext[typeof ANALYTICS_APP_NAME],
  [ANALYTICS_LOGGED_IN_STATUS]: 'NOT_LOGGED_IN' as TrackStateContext[typeof ANALYTICS_LOGGED_IN_STATUS],
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
