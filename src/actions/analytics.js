import { ACTIONS, ANALYTICS, ANALYTICS_CONTEXT_CHANGED } from '../constants';
import * as RNOmniture from 'react-native-omniture';

export function updateAnalyticsContext(analyticsContext) {
  return {
    type: ANALYTICS_CONTEXT_CHANGED,
    analyticsContext: analyticsContext,
  };
}

export function trackSearchFilter(label) {
  return (dispatch) => {
    dispatch(trackAction(ACTIONS.FILTER_ENGAGED, { [ACTIONS.SEARCH_FILTER]: label }));
  };
}

export function trackAction(action, data = {}) {
  return () => RNOmniture.trackAction(action, data);
}

export function trackState(trackingObj) {
  return (dispatch, getState) => {
    if (!trackingObj) {
      return;
    }
    const newTrackingObj = { ...trackingObj, name: `mh : ${trackingObj.name}` };

    const updatedContext = buildUpdatedContext(newTrackingObj, getState().analytics);

    RNOmniture.trackState(newTrackingObj.name, updatedContext);

    return dispatch(updateAnalyticsContext(updatedContext));
  };
}

function buildUpdatedContext(trackingObj, context) {
  return {
    ...context,
    [ANALYTICS.SCREENNAME]: trackingObj.name,
    [ANALYTICS.PAGE_NAME]: trackingObj.name,
    [ANALYTICS.SITE_SECTION]: trackingObj.section,
    [ANALYTICS.SITE_SUBSECTION]: trackingObj.subsection,
    [ANALYTICS.SITE_SUB_SECTION_3]: trackingObj.level3,
  };
}

export function updateLoggedInStatus(status) {
  return (dispatch, getState) => {

    const context = getState().analytics;
    const updatedContext = {
      ...context,
      [ANALYTICS.LOGGED_IN_STATUS]: status,
    };

    RNOmniture.syncMarketingCloudId(updatedContext[ANALYTICS.MCID]);
    return dispatch(updateAnalyticsContext(updatedContext));
  };
}
