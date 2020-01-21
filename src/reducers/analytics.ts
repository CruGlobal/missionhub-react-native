import i18next from 'i18next';

import {
  ANALYTICS_CONTEXT_CHANGED,
  ANALYTICS,
  NOT_LOGGED_IN,
  LOGOUT,
  RELOAD_APP,
} from '../constants';
import { REQUESTS } from '../api/routes';
import {
  RESET_APP_CONTEXT,
  ResetAppContextAction,
  SET_APP_CONTEXT,
  SetAppContextAction,
} from '../actions/analytics';

export const initialAnalyticsState = {
  [ANALYTICS.MCID]: '',
  [ANALYTICS.PREVIOUS_SCREEN_NAME]: '',
  [ANALYTICS.APP_NAME]: 'MissionHub App',
  [ANALYTICS.LOGGED_IN_STATUS]: NOT_LOGGED_IN,
  [ANALYTICS.SSO_GUID]: '',
  [ANALYTICS.GR_MASTER_PERSON_ID]: '',
  [ANALYTICS.FACEBOOK_ID]: '',
  [ANALYTICS.CONTENT_LANGUAGE]: i18next.language,
  [ANALYTICS.APP_CONTEXT]: '',
};

export type AnalyticsState = typeof initialAnalyticsState;

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
  | SetAppContextAction
  | ResetAppContextAction
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
        [ANALYTICS.SSO_GUID]: action.results.thekey_guid,
      };
    case SET_APP_CONTEXT:
      return {
        ...state,
        [ANALYTICS.APP_CONTEXT]: action.context,
      };
    case RESET_APP_CONTEXT:
      return {
        ...state,
        [ANALYTICS.APP_CONTEXT]: '',
      };
    case RELOAD_APP:
      return {
        ...state,
        [ANALYTICS.PREVIOUS_SCREEN_NAME]: '',
      };
    case LOGOUT:
      return {
        ...state,
        [ANALYTICS.LOGGED_IN_STATUS]: NOT_LOGGED_IN,
        [ANALYTICS.SSO_GUID]: '',
        [ANALYTICS.GR_MASTER_PERSON_ID]: '',
        [ANALYTICS.FACEBOOK_ID]: '',
        [ANALYTICS.APP_CONTEXT]: '',
      };
    default:
      return state;
  }
}

export default analyticsReducer;
