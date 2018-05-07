import * as RNOmniture from 'react-native-omniture';

import {
  ACTIONS, ANALYTICS, ANALYTICS_CONTEXT_CHANGED, LOGGED_IN,
  NOT_LOGGED_IN,
} from '../constants';
import { isCustomStep } from '../utils/common';

export function updateAnalyticsContext(analyticsContext) {
  return {
    type: ANALYTICS_CONTEXT_CHANGED,
    analyticsContext: analyticsContext,
  };
}

export function trackStepsAdded(steps) {
  return (dispatch) => {
    steps.forEach((step) => {
      let trackedStep = `${step.challenge_type} | ${step.self_step ? 'Y' : 'N'} | ${step.locale}`;

      if (isCustomStep(step)) {
        dispatch(trackActionWithoutData(ACTIONS.STEP_CREATED));

      } else {
        trackedStep = `${trackedStep} | ${step.id} | ${step.pathway_stage.id}`;
      }

      dispatch(trackAction(ACTIONS.STEP_DETAIL.name, { [ACTIONS.STEP_DETAIL.key]: trackedStep } ));
    });

    dispatch(trackAction(ACTIONS.STEPS_ADDED.name, { [ACTIONS.STEPS_ADDED.key]: steps.length }));
  };
}

export function trackSearchFilter(label) {
  return (dispatch) => {
    dispatch(trackAction(ACTIONS.FILTER_ENGAGED.name, {
      [ACTIONS.SEARCH_FILTER.key]: label,
      [ACTIONS.FILTER_ENGAGED.key]: null,
    }));
  };
}

export function trackActionWithoutData(action) {
  return trackAction(action.name, { [action.key]: null });
}

export function trackAction(action, data) {
  return () => RNOmniture.trackAction(action, data);
}

export function trackState(trackingObj) {
  return (dispatch, getState) => {
    if (!trackingObj) {
      return;
    }
    const newTrackingObj = { ...trackingObj, name: `mh : ${trackingObj.name}` };
    const updatedContext = buildUpdatedContext(newTrackingObj, getState);

    dispatch(updateAnalyticsContext(updatedContext));
    return dispatch(trackStateWithMCID(updatedContext));
  };
}

function trackStateWithMCID(context) {
  return (dispatch) => {
    if (context[ANALYTICS.MCID]) {
      RNOmniture.trackState(context[ANALYTICS.SCREENNAME], context);

    } else {
      RNOmniture.loadMarketingCloudId((result) => {
        const updatedContext = { ...context, [ANALYTICS.MCID]: result };

        RNOmniture.trackState(updatedContext[ANALYTICS.SCREENNAME], updatedContext);
        dispatch(updateAnalyticsContext(updatedContext));
      });
    }
  };

}

function buildUpdatedContext(trackingObj, getState) {
  const { analytics, auth } = getState();

  return {
    ...analytics,
    [ANALYTICS.SCREENNAME]: trackingObj.name,
    [ANALYTICS.SITE_SECTION]: trackingObj.section,
    [ANALYTICS.SITE_SUBSECTION]: trackingObj.subsection,
    [ANALYTICS.SITE_SUB_SECTION_3]: trackingObj.level3,
    [ANALYTICS.GR_MASTER_PERSON_ID]: auth.person.global_registry_mdm_id,
  };
}

export function logOutAnalytics() {
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

export function logInAnalytics() {
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
