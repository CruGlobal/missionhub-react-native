import i18next from 'i18next';

import {
  ANALYTICS_CONTEXT_CHANGED,
  ANALYTICS,
  NOT_LOGGED_IN,
  LOGOUT,
  ANALYTICS_CONTEXT_ONBOARDING,
} from '../constants';
import { REQUESTS } from '../api/routes';
import { RESET_APP_CONTEXT, ResetAppContextAction } from '../actions/analytics';
import { START_ONBOARDING, StartOnboardingAction } from '../actions/onboarding';

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
  | StartOnboardingAction
  | ResetAppContextAction
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
    case START_ONBOARDING:
      return {
        ...state,
        [ANALYTICS.APP_CONTEXT]: ANALYTICS_CONTEXT_ONBOARDING,
      };
    case RESET_APP_CONTEXT:
      return {
        ...state,
        [ANALYTICS.APP_CONTEXT]: '',
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
