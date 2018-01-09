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

    RNOmniture.trackState(this.constructor.name, context);

    return dispatch(updateAnalyticsContext(context));
  };

}