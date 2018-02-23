import {
  ACTIONS, ANALYTICS, ANALYTICS_CONTEXT_CHANGED, CUSTOM_STEP_TYPE, LOGGED_IN,
  NOT_LOGGED_IN,
} from '../constants';
import * as RNOmniture from 'react-native-omniture';

export function updateAnalyticsContext(analyticsContext) {
  return {
    type: ANALYTICS_CONTEXT_CHANGED,
    analyticsContext: analyticsContext,
  };
}

export function trackStepsAdded(steps) {
  return (dispatch) => {
    steps.forEach((step) => {
      const trackedStep = {
        [ACTIONS.STEP_FIELDS.TYPE]: step.challenge_type,
        [ACTIONS.STEP_FIELDS.SELF]: step.self_step ? 'Y' : 'N',
        [ACTIONS.STEP_FIELDS.LOCALE]: step.locale,
      };

      if (step.challenge_type === CUSTOM_STEP_TYPE) {
        dispatch(trackAction(ACTIONS.STEP_CREATED));

      } else {
        trackedStep[ACTIONS.STEP_FIELDS.ID] = step.id;
        trackedStep[ACTIONS.STEP_FIELDS.STAGE] = step.pathway_stage.id;
      }

      dispatch(trackAction(ACTIONS.STEP_DETAIL, trackedStep));
    });

    dispatch(trackAction(ACTIONS.STEPS_ADDED, { 'steps': steps.length }));
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

export function logOut() {
  return (dispatch, getState) => {

    const context = getState().analytics;
    const updatedContext = {
      ...context,
      [ANALYTICS.LOGGED_IN_STATUS]: NOT_LOGGED_IN,
      [ANALYTICS.SSO_GUID]: '',
    };

    return dispatch(updateAnalyticsContext(updatedContext));
  };
}

export function logIn() {
  return (dispatch, getState) => {

    const context = getState().analytics;
    const updatedContext = {
      ...context,
      [ANALYTICS.LOGGED_IN_STATUS]: LOGGED_IN,
    };

    RNOmniture.syncIdentifier(updatedContext[ANALYTICS.SSO_GUID]);
    return dispatch(updateAnalyticsContext(updatedContext));
  };
}
