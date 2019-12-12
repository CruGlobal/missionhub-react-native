import * as RNOmniture from 'react-native-omniture';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Tracker } from '@ringierag/snowplow-reactjs-native-tracker';
import Config from 'react-native-config';

import {
  ACTIONS,
  ANALYTICS,
  ANALYTICS_CONTEXT_CHANGED,
  LOGGED_IN,
  ID_SCHEMA,
} from '../constants';
import { isCustomStep } from '../utils/common';

export function trackScreenChange(screenNameFragments, extraContext = {}) {
  return (dispatch, getState) => {
    const {
      analytics: { [ANALYTICS.MCID]: MCID },
    } = getState();

    const screenName = screenNameFragments.reduce(
      (name, current) => `${name} : ${current}`,
      'mh',
    );

    if (MCID) {
      sendScreenChange(screenName, { ...extraContext, [ANALYTICS.MCID]: MCID });
    } else {
      RNOmniture.loadMarketingCloudId(result => {
        const updatedContext = { ...extraContext, [ANALYTICS.MCID]: result };

        sendScreenChange(screenName, extraContext);
        dispatch(updateAnalyticsContext(updatedContext));
      });
    }
  };
}

function sendScreenChange(screenName, context) {
  RNOmniture.trackState(screenName, context);
  //sendStateToSnowplow(context);
}

export function updateAnalyticsContext(analyticsContext) {
  return {
    type: ANALYTICS_CONTEXT_CHANGED,
    analyticsContext: analyticsContext,
  };
}

export function trackStepAdded(step) {
  return dispatch => {
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

    dispatch(
      trackAction(ACTIONS.STEPS_ADDED.name, {
        [ACTIONS.STEPS_ADDED.key]: 1, // One step of faith added. Historically multiple could be added at once and needed to be tracked.
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function sendStateToSnowplow(context) {
  const idData = {
    gr_master_person_id: context[ANALYTICS.GR_MASTER_PERSON_ID],
    sso_guid: context[ANALYTICS.SSO_GUID],
    mcid: context[ANALYTICS.MCID],
  };

  const tracker = new Tracker(
    [
      /*em*/
    ],
    null,
    Config.SNOWPLOW_APP_ID,
    true,
  );
  tracker.core.addPayloadPair('url', context[ANALYTICS.SCREENNAME]);

  tracker.trackScreenView(context[ANALYTICS.SCREENNAME], null, [
    {
      schema: ID_SCHEMA,
      data: idData,
    },
  ]);
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
