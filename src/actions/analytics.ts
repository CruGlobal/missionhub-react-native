import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import * as RNOmniture from 'react-native-omniture';
//import { Tracker } from '@ringierag/snowplow-reactjs-native-tracker';
//import Config from 'react-native-config';

import {
  ACTIONS,
  ANALYTICS,
  ANALYTICS_CONTEXT_CHANGED,
  LOGGED_IN,
  //ID_SCHEMA,
} from '../constants';
import { AnalyticsState } from '../reducers/analytics';
import { SuggestedStep } from '../reducers/steps';
import { isCustomStep } from '../utils/common';

export function trackScreenChange(screenNameFragments: string[]) {
  return (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    getState: () => { analytics: AnalyticsState },
  ) => {
    const { analytics } = getState();
    const { [ANALYTICS.MCID]: mcid } = analytics;
    const screenName = screenNameFragments.reduce(
      (name, current) => `${name} : ${current}`,
      'mh',
    );

    const sendScreenChange = (MCID: string) => {
      const context = {
        ...analytics,
        [ANALYTICS.MCID]: MCID,
        [ANALYTICS.SCREEN_NAME]: screenName,
        [ANALYTICS.SITE_SECTION]: screenNameFragments[0],
        [ANALYTICS.SITE_SUBSECTION]: screenNameFragments[1],
        [ANALYTICS.SITE_SUBSECTION_3]: screenNameFragments[2],
      };

      RNOmniture.trackState(screenName, context);
      //sendStateToSnowplow(context);
      dispatch(
        updateAnalyticsContext({
          [ANALYTICS.PREVIOUS_SCREEN_NAME]: screenName,
        }),
      );
    };

    if (mcid !== '') {
      sendScreenChange(mcid);
    } else {
      RNOmniture.loadMarketingCloudId(result => {
        sendScreenChange(result);
      });
    }
  };
}

export function updateAnalyticsContext(
  analyticsContext: Partial<AnalyticsState>,
) {
  return {
    type: ANALYTICS_CONTEXT_CHANGED,
    analyticsContext,
  };
}

export function trackStepAdded(step: SuggestedStep) {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
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

export function trackSearchFilter(label: string) {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(
      trackAction(ACTIONS.FILTER_ENGAGED.name, {
        [ACTIONS.SEARCH_FILTER.key]: label,
        [ACTIONS.FILTER_ENGAGED.key]: null,
      }),
    );
  };
}

export function trackActionWithoutData(action: { name: string; key: string }) {
  return trackAction(action.name, { [action.key]: null });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function trackAction(action: string, data: { [key: string]: any }) {
  const newData = Object.keys(data).reduce(
    (acc, key) => ({ ...acc, [key]: data[key] ? data[key] : '1' }),
    {},
  );

  return () => RNOmniture.trackAction(action, newData);
}

/*
function sendStateToSnowplow(context: { [key: string]: string }) {
  const idData = {
    gr_master_person_id: context[ANALYTICS.GR_MASTER_PERSON_ID],
    sso_guid: context[ANALYTICS.SSO_GUID],
    mcid: context[ANALYTICS.MCID],
  };

  const tracker = new Tracker(
    [
      //em
    ],
    null,
    Config.SNOWPLOW_APP_ID,
    true,
  );
  tracker.core.addPayloadPair('url', context[ANALYTICS.SCREEN_NAME]);

  tracker.trackScreenView(context[ANALYTICS.SCREEN_NAME], null, [
    {
      schema: ID_SCHEMA,
      data: idData,
    },
  ]);
}
*/

export function logInAnalytics() {
  return (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    getState: () => { analytics: AnalyticsState },
  ) => {
    const context = getState().analytics;
    const updatedContext = {
      ...context,
      [ANALYTICS.LOGGED_IN_STATUS]: LOGGED_IN,
    };

    return dispatch(updateAnalyticsContext(updatedContext));
  };
}
