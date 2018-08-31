import * as RNOmniture from 'react-native-omniture';
import { Tracker, Emitter } from '@ringierag/snowplow-reactjs-native-tracker';
import Config from 'react-native-config';

import {
  ACTIONS,
  ANALYTICS,
  ANALYTICS_CONTEXT_CHANGED,
  LOGGED_IN,
  ID_SCHEMA,
} from '../constants';
import { isCustomStep } from '../utils/common';

/* testing only */
export const emitterCallback = (error, response) => {
  if (error) {
    return Promise.reject({
      snowplowError: error,
    });
  } else if (response && response.status !== 200) {
    return Promise.reject({
      snowplowError: response,
    });
  }
};

const em = new Emitter(
  Config.SNOWPLOW_URL,
  'https',
  443,
  'POST',
  1,
  emitterCallback,
);

export function updateAnalyticsContext(analyticsContext) {
  return {
    type: ANALYTICS_CONTEXT_CHANGED,
    analyticsContext: analyticsContext,
  };
}

export function trackStepsAdded(steps) {
  return dispatch => {
    steps.forEach(step => {
      let trackedStep = `${step.challenge_type} | ${
        step.self_step ? 'Y' : 'N'
      } | ${step.locale}`;

      if (isCustomStep(step)) {
        dispatch(trackActionWithoutData(ACTIONS.STEP_CREATED));
      } else {
        trackedStep = `${trackedStep} | ${step.id} | ${step.pathway_stage.id}`;
      }

      dispatch(
        trackAction(ACTIONS.STEP_DETAIL.name, {
          [ACTIONS.STEP_DETAIL.key]: trackedStep,
        }),
      );
    });

    dispatch(
      trackAction(ACTIONS.STEPS_ADDED.name, {
        [ACTIONS.STEPS_ADDED.key]: steps.length,
      }),
    );
  };
}

export function trackSearchFilter(label) {
  return dispatch => {
    dispatch(
      trackAction(ACTIONS.FILTER_ENGAGED.name, {
        [ACTIONS.SEARCH_FILTER.key]: label,
        [ACTIONS.FILTER_ENGAGED.key]: null,
      }),
    );
  };
}

export function trackActionWithoutData(action) {
  return trackAction(action.name, { [action.key]: null });
}

export function trackAction(action, data) {
  const newData = Object.keys(data).reduce(
    (acc, key) => ({ ...acc, [key]: data[key] ? data[key] : '1' }),
    {},
  );

  return () => RNOmniture.trackAction(action, newData);
}

export function trackState(trackingObj) {
  return (dispatch, getState) => {
    if (!trackingObj) {
      return;
    }
    const { analytics, auth } = getState();

    const updatedContext = addTrackingObjToContext(
      trackingObj,
      analytics,
      auth,
    );

    dispatch(updateAnalyticsContext(updatedContext));
    return dispatch(trackStateWithMCID(updatedContext));
  };
}

function trackStateWithMCID(context) {
  return dispatch => {
    if (context[ANALYTICS.MCID]) {
      sendStateToAdobeAndSnowplow(context);
    } else {
      RNOmniture.loadMarketingCloudId(result => {
        const updatedContext = { ...context, [ANALYTICS.MCID]: result };

        sendStateToAdobeAndSnowplow(updatedContext);
        dispatch(updateAnalyticsContext(updatedContext));
      });
    }
  };
}

function sendStateToAdobeAndSnowplow(context) {
  RNOmniture.trackState(context[ANALYTICS.SCREENNAME], context);
  sendStateToSnowplow(context);
}

function sendStateToSnowplow(context) {
  const idData = {
    gr_master_person_id: context[ANALYTICS.GR_MASTER_PERSON_ID],
    sso_guid: context[ANALYTICS.SSO_GUID],
    mcid: context[ANALYTICS.MCID],
    //tntid: '',
  };

  const tracker = new Tracker([em], null, Config.SNOWPLOW_APP_ID, true);
  tracker.core.addPayloadPair('url', context[ANALYTICS.SCREENNAME]);
  tracker.core.addPayloadPair('refr', context[ANALYTICS.PREVIOUS_SCREENNAME]);

  tracker.trackScreenView(context[ANALYTICS.SCREENNAME], null, [
    {
      schema: ID_SCHEMA,
      data: idData,
    },
  ]);
}

function addTrackingObjToContext(trackingObj, analytics, auth) {
  const newTrackingObj = { ...trackingObj, name: `mh : ${trackingObj.name}` };

  return {
    ...analytics,
    [ANALYTICS.SCREENNAME]: newTrackingObj.name,
    [ANALYTICS.SITE_SECTION]: newTrackingObj.section,
    [ANALYTICS.SITE_SUBSECTION]: newTrackingObj.subsection,
    [ANALYTICS.SITE_SUB_SECTION_3]: newTrackingObj.level3,
    [ANALYTICS.GR_MASTER_PERSON_ID]: auth.person.global_registry_mdm_id,
  };
}

export function logInAnalytics() {
  return (dispatch, getState) => {
    const context = getState().analytics;
    const updatedContext = {
      ...context,
      [ANALYTICS.LOGGED_IN_STATUS]: LOGGED_IN,
    };

    return dispatch(updateAnalyticsContext(updatedContext));
  };
}
