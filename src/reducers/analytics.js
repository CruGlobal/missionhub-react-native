import { REHYDRATE } from 'redux-persist/constants';

import { ANALYTICS_CONTEXT_CHANGED, ANALYTICS } from '../constants';

const initialAnalyticsState = buildInitialState();

function buildInitialState() {
  const state = {};
  state[ANALYTICS.MCID] = '';
  state[ANALYTICS.SCREENNAME] = '';
  state[ANALYTICS.PREVIOUS_SCREENAME] = '';
  state[ANALYTICS.SITE_SECTION] = '';
  state[ANALYTICS.SITE_SUBSECTION] = '';
  state[ANALYTICS.SITE_SUB_SECTION_3] = '';
  state[ANALYTICS.SITE_SUB_SECTION_4] = '';
  state[ANALYTICS.CONTENT_AUDIENCE_TARGET] = '';
  state[ANALYTICS.CONTENT_TOPIC] = '';
  state[ANALYTICS.LOGGED_IN_STATUS] = '';
  state[ANALYTICS.SSO_GUID] = '';
  state['cru.appname'] = 'MissionHub App';
  state[ANALYTICS.GR_MASTER_PERSON_ID] = '';
  state[ANALYTICS.FACEBOOK_ID] = '';
  state[ANALYTICS.CONTENT_LANGUAGE] = '';

  return state;
}

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
    default:
      return state;
  }
}

export default analyticsReducer;
