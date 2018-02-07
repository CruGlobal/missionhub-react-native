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

export function trackState(screenName) {
  return (dispatch, getState) => {

    screenName = `mh : ${screenName}`;
    const updatedContext = buildUpdatedContext(screenName, getState().analytics);

    RNOmniture.trackState(screenName, updatedContext);

    return dispatch(updateAnalyticsContext(updatedContext));
  };
}

function buildUpdatedContext(screenName, context) {
  const updatedContext = {
    ...context,
    [ANALYTICS.PREVIOUS_SCREENNAME]: context[ANALYTICS.SCREENNAME],
    [ANALYTICS.SCREENNAME]: screenName,
    [ANALYTICS.PAGE_NAME]: screenName,
  };

  const namesArray = screenName.split(':');
  updatedContext[ANALYTICS.SITE_SECTION] = namesArray[1].trim();

  if (namesArray.length >= 4) {
    updatedContext[ANALYTICS.SITE_SUBSECTION] = namesArray[2].trim();

    if (namesArray.length === 5) {
      updatedContext[ANALYTICS.SITE_SUB_SECTION_3] = namesArray[3].trim();
    }
  }

  return updatedContext;
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
