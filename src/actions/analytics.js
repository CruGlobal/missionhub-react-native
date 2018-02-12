import { ANALYTICS, ANALYTICS_CONTEXT_CHANGED } from '../constants';
import * as RNOmniture from 'react-native-omniture';

export function updateAnalyticsContext(analyticsContext) {
  return {
    type: ANALYTICS_CONTEXT_CHANGED,
    analyticsContext: analyticsContext,
  };
}

export function trackAction(action, data) {
  return () => RNOmniture.trackAction(action, data);
}

export function trackState(trackingObj) {
  console.log(trackingObj);

  return (dispatch, getState) => {

    trackingObj.name = `mh : ${trackingObj.name}`;
    const updatedContext = buildUpdatedContext(trackingObj, getState().analytics);

    RNOmniture.trackState(trackingObj.name, updatedContext);

    return dispatch(updateAnalyticsContext(updatedContext));
  };
}

function buildUpdatedContext(trackingObj, context) {
  return {
    ...context,
    [ANALYTICS.PREVIOUS_SCREENNAME]: context[ANALYTICS.SCREENNAME],
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
