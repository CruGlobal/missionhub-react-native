import { ANALYTICS_CONTEXT_CHANGED } from '../constants';

export function updateAnalyticsContext(analyticsContext) {
  return {
    type: ANALYTICS_CONTEXT_CHANGED,
    analyticsContext: analyticsContext,
  };
}
