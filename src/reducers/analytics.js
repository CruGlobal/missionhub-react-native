import { REHYDRATE } from 'redux-persist/constants';

import { ANALYTICS_CONTEXT_CHANGED, ANALYTICS } from '../constants';
import { REQUESTS } from '../actions/api';

const initialAnalyticsState = {
  [ANALYTICS.PAGE_NAME]: '',
  [ANALYTICS.MCID]: '',
  [ANALYTICS.SCREENNAME]: '',
  [ANALYTICS.PREVIOUS_SCREENNAME]: '',
  [ANALYTICS.SITE_SECTION]: '',
  [ANALYTICS.SITE_SUBSECTION]: '',
  [ANALYTICS.SITE_SUB_SECTION_3]: '',
  [ANALYTICS.CONTENT_AUDIENCE_TARGET]: '',
  [ANALYTICS.CONTENT_TOPIC]: '',
  [ANALYTICS.LOGGED_IN_STATUS]: false,
  [ANALYTICS.SSO_GUID]: '',
  ['cru.appname']: 'MissionHub App',
  [ANALYTICS.GR_MASTER_PERSON_ID]: '',
  [ANALYTICS.FACEBOOK_ID]: '',
  [ANALYTICS.CONTENT_LANGUAGE]: '',
};

function analyticsReducer(state = initialAnalyticsState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.analytics;

      if (incoming) {
        return {
          ...state,
          ...incoming,
        };
      }
      return state;
    case ANALYTICS_CONTEXT_CHANGED:
      return {
        ...state,
        ...action.analyticsContext,
      };
    case REQUESTS.KEY_LOGIN.SUCCESS:
      return {
        ...state,
        [ANALYTICS.SSO_GUID]: action.results.thekey_guid,
      };
    default:
      return state;
  }
}

export default analyticsReducer;
