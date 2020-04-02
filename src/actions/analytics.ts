import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import * as RNOmniture from 'react-native-omniture';
import appsFlyer from 'react-native-appsflyer';
//import { Tracker } from '@ringierag/snowplow-reactjs-native-tracker';

import {
  ACTIONS,
  ANALYTICS_MCID,
  ANALYTICS_SCREEN_NAME,
  ANALYTICS_SITE_SECTION,
  ANALYTICS_SITE_SUBSECTION,
  ANALYTICS_SITE_SUBSECTION_3,
  ANALYTICS_PREVIOUS_SCREEN_NAME,
  ANALYTICS_APP_NAME,
  ANALYTICS_LOGGED_IN_STATUS,
  ANALYTICS_SSO_GUID,
  ANALYTICS_GR_MASTER_PERSON_ID,
  ANALYTICS_FACEBOOK_ID,
  ANALYTICS_CONTENT_LANGUAGE,
  ANALYTICS_SECTION_TYPE,
  ANALYTICS_ASSIGNMENT_TYPE,
  ANALYTICS_EDIT_MODE,
  ANALYTICS_PERMISSION_TYPE,
  ANALYTICS_MINISTRY_MODE,
  LOGGED_IN,
  NOT_LOGGED_IN,
  //ID_SCHEMA,
} from '../constants';
import { AnalyticsState } from '../reducers/analytics';
import { SuggestedStep } from '../reducers/steps';
import { AuthState } from '../reducers/auth';
import { isCustomStep, userIsJean } from '../utils/common';

export interface TrackStateContext {
  [ANALYTICS_MCID]: string;
  [ANALYTICS_SCREEN_NAME]: string;
  [ANALYTICS_SITE_SECTION]: string;
  [ANALYTICS_SITE_SUBSECTION]: string;
  [ANALYTICS_SITE_SUBSECTION_3]: string;
  [ANALYTICS_PREVIOUS_SCREEN_NAME]: string;
  [ANALYTICS_APP_NAME]: 'MissionHub App';
  [ANALYTICS_LOGGED_IN_STATUS]: typeof LOGGED_IN | typeof NOT_LOGGED_IN;
  [ANALYTICS_SSO_GUID]: string;
  [ANALYTICS_GR_MASTER_PERSON_ID]: string;
  [ANALYTICS_FACEBOOK_ID]: string;
  [ANALYTICS_CONTENT_LANGUAGE]: string;
  [ANALYTICS_SECTION_TYPE]: 'onboarding' | '';
  [ANALYTICS_ASSIGNMENT_TYPE]: 'self' | 'contact' | 'community member' | '';
  [ANALYTICS_EDIT_MODE]: 'set' | 'update' | '';
  [ANALYTICS_PERMISSION_TYPE]: 'owner' | 'member' | 'admin' | '';
  [ANALYTICS_MINISTRY_MODE]: boolean;
}

export interface ScreenContext {
  [ANALYTICS_SECTION_TYPE]: TrackStateContext[typeof ANALYTICS_SECTION_TYPE];
  [ANALYTICS_ASSIGNMENT_TYPE]: TrackStateContext[typeof ANALYTICS_ASSIGNMENT_TYPE];
  [ANALYTICS_EDIT_MODE]: TrackStateContext[typeof ANALYTICS_EDIT_MODE];
  [ANALYTICS_PERMISSION_TYPE]: TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE];
}

export const ANALYTICS_CONTEXT_CHANGED = 'ANALYTICS_CONTEXT_CHANGED';

export const setAnalyticsMinistryMode = () => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
  getState: () => { auth: AuthState },
) => {
  const authPersonPermissions = getState().auth.person
    .organizational_permissions;
  dispatch(
    updateAnalyticsContext({
      [ANALYTICS_MINISTRY_MODE]: userIsJean(authPersonPermissions),
    }),
  );
};

export const trackScreenChange = (
  screenName: string | string[],
  screenContext: Partial<ScreenContext> = {},
) => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
  getState: () => { analytics: AnalyticsState },
) => {
  const { analytics } = getState();
  const { [ANALYTICS_MCID]: mcid } = analytics;

  const screenFragments = Array.isArray(screenName) ? screenName : [screenName];
  const screen = screenFragments.reduce(
    (name, current) => `${name} : ${current}`,
    'mh',
  );

  const sendScreenChange = (MCID: string) => {
    const context: TrackStateContext = {
      ...analytics,
      [ANALYTICS_SECTION_TYPE]: '',
      [ANALYTICS_ASSIGNMENT_TYPE]: '',
      [ANALYTICS_EDIT_MODE]: '',
      [ANALYTICS_PERMISSION_TYPE]: '',
      ...screenContext,
      [ANALYTICS_MCID]: MCID,
      [ANALYTICS_SCREEN_NAME]: screen,
      [ANALYTICS_SITE_SECTION]: screenFragments[0],
      [ANALYTICS_SITE_SUBSECTION]: screenFragments[1],
      [ANALYTICS_SITE_SUBSECTION_3]: screenFragments[2],
    };

    RNOmniture.trackState(screen, context);
    //sendStateToSnowplow(context);
    dispatch(
      updateAnalyticsContext({
        [ANALYTICS_PREVIOUS_SCREEN_NAME]: screen,
      }),
    );
  };

  if (mcid !== '') {
    sendScreenChange(mcid);
  } else {
    RNOmniture.loadMarketingCloudId(result => {
      sendScreenChange(result);
      appsFlyer.setAdditionalData({ ECID: result });
    });
  }
};

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
      [ANALYTICS_LOGGED_IN_STATUS]: LOGGED_IN,
    } as AnalyticsState;

    return dispatch(updateAnalyticsContext(updatedContext));
  };
}
