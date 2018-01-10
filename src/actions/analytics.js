import { ANALYTICS, ANALYTICS_CONTEXT_CHANGED } from '../constants';
import * as RNOmniture from 'react-native-omniture';

export function updateAnalyticsContext(analyticsContext) {
  return {
    type: ANALYTICS_CONTEXT_CHANGED,
    analyticsContext: analyticsContext,
  };
}

export function trackState(screenName) {
  return (dispatch, getState) => {

    const context = getState().analytics;
    context[ANALYTICS.PREVIOUS_SCREENNAME] = context[ANALYTICS.SCREENNAME];
    context[ANALYTICS.SCREENNAME] = screenName;
    context[ANALYTICS.PAGE_NAME] = screenName;

    RNOmniture.trackState(screenName, context);

    return dispatch(updateAnalyticsContext(context));
  };
}

export function updateLoggedInStatus(status) {
  return (dispatch, getState) => {

    const context = getState().analytics;
    context[ANALYTICS.LOGGED_IN_STATUS] = status;

    RNOmniture.syncMarketingCloudId(context[ANALYTICS.MCID]);

    return dispatch(updateAnalyticsContext(context));
  };
}