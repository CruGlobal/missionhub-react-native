import i18n from 'i18next';

import {
  ANALYTICS_CONTEXT_CHANGED,
  ANALYTICS,
  NOT_LOGGED_IN,
  LOGOUT,
} from '../constants';
import { REQUESTS } from '../api/routes';

export const initialAnalyticsState = {
  [ANALYTICS.MCID]: '',
  [ANALYTICS.SCREENNAME]: '',
  [ANALYTICS.SITE_SECTION]: '',
  [ANALYTICS.SITE_SUBSECTION]: '',
  [ANALYTICS.SITE_SUB_SECTION_3]: '',
  [ANALYTICS.CONTENT_AUDIENCE_TARGET]: '',
  [ANALYTICS.CONTENT_TOPIC]: '',
  [ANALYTICS.LOGGED_IN_STATUS]: NOT_LOGGED_IN,
  [ANALYTICS.SSO_GUID]: '',
  ['cru.appname']: 'MissionHub App',
  [ANALYTICS.GR_MASTER_PERSON_ID]: '',
  [ANALYTICS.FACEBOOK_ID]: '',
  [ANALYTICS.CONTENT_LANGUAGE]: i18n.language,
};

interface AnalyticsContextChangedAction {
  type: typeof ANALYTICS_CONTEXT_CHANGED;
  analyticsContext: Partial<typeof initialAnalyticsState>;
}

interface KeyLoginSuccessAction {
  type: typeof REQUESTS.KEY_LOGIN.SUCCESS;
  results: { thekey_guid: string };
}

type AnalyticsAction =
  | AnalyticsContextChangedAction
  | KeyLoginSuccessAction
  | { type: typeof LOGOUT };

function analyticsReducer(
  state = initialAnalyticsState,
  action: AnalyticsAction,
) {
  switch (action.type) {
    case ANALYTICS_CONTEXT_CHANGED:
      return {
        ...state,
        ...(action.analyticsContext as typeof initialAnalyticsState),
      };
    case REQUESTS.KEY_LOGIN.SUCCESS:
      return {
        ...state,
        [ANALYTICS.SSO_GUID]: action.results.thekey_guid,
      };
    case LOGOUT:
      return {
        ...state,
        [ANALYTICS.SSO_GUID]: '',
        [ANALYTICS.GR_MASTER_PERSON_ID]: '',
        [ANALYTICS.FACEBOOK_ID]: '',
        [ANALYTICS.LOGGED_IN_STATUS]: NOT_LOGGED_IN,
      };
    default:
      return state;
  }
}

export default analyticsReducer;
