import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import FBAnalytics from '@react-native-firebase/analytics';
import i18next from 'i18next';
import appsFlyer from 'react-native-appsflyer';
//import { Tracker } from '@ringierag/snowplow-reactjs-native-tracker';

import {
  ACTIONS,
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
  LOGGED_IN,
  NOT_LOGGED_IN,
  //ID_SCHEMA,
} from '../constants';
import { AnalyticsState } from '../reducers/analytics';
import { RootState } from '../reducers';
import { getAuthPerson } from '../auth/authUtilities';

import { StepAddedAnalytics } from './__generated__/StepAddedAnalytics';

export interface TrackStateContext {
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
  [ANALYTICS_ASSIGNMENT_TYPE]: 'self' | 'contact' | 'community_member' | '';
  [ANALYTICS_EDIT_MODE]: 'set' | 'update' | '';
  [ANALYTICS_PERMISSION_TYPE]: 'owner' | 'member' | 'admin' | '';
}

export const ANALYTICS_CONTEXT_CHANGED = 'ANALYTICS_CONTEXT_CHANGED';

export const trackScreenChange = (screenName: string | string[]) => (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  getState: () => { analytics: AnalyticsState },
) => {
  const { analytics } = getState();

  FBAnalytics().setUserProperties({
    debug: __DEV__.toString(),
    cru_grmasterpersonid: analytics[ANALYTICS_GR_MASTER_PERSON_ID] || null,
    cru_loggedinstatus:
      analytics[ANALYTICS_LOGGED_IN_STATUS] === 'logged_in' ? 'true' : 'false',
    cru_ssoguid: analytics[ANALYTICS_SSO_GUID] || null,
  });
  const screenFragments = Array.isArray(screenName) ? screenName : [screenName];
  const screen = screenFragments.reduce(
    (name, current) => `${name} : ${current}`,
    'mh',
  );

  const sendScreenChange = () => {
    //sendStateToSnowplow(context);
    dispatch(
      updateAnalyticsContext({
        [ANALYTICS_PREVIOUS_SCREEN_NAME]: screen,
      }),
    );
    FBAnalytics().logScreenView({ screen_name: screen });
  };
  sendScreenChange();
};

export function updateAnalyticsContext(
  analyticsContext: Partial<AnalyticsState>,
) {
  return {
    type: ANALYTICS_CONTEXT_CHANGED,
    analyticsContext,
  };
}

export function trackStepAdded(step?: StepAddedAnalytics | null) {
  return (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    if (!step) {
      return;
    }
    const myId = getAuthPerson().id;

    let trackedStep = `${step.stepType} | ${
      step.receiver.id === myId ? 'Y' : 'N' // Is self step?
    } | ${i18next.language}`;

    if (step.stepSuggestion) {
      trackedStep = `${trackedStep} | ${step.stepSuggestion.id} | ${step.stepSuggestion.stage.id}`;
    } else {
      dispatch(trackActionWithoutData(ACTIONS.STEP_CREATED));
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
    appsFlyer.trackEvent(ACTIONS.STEPS_ADDED.name, ACTIONS.STEPS_ADDED);
  };
}

export function trackStepDeleted(screen: string) {
  return (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    dispatch(
      trackAction(`${ACTIONS.STEP_REMOVED.name} on ${screen} Screen`, {
        [ACTIONS.STEP_REMOVED.key]: null,
      }),
    );
  };
}

export function trackActionWithoutData(action: { name: string; key: string }) {
  return trackAction(action.name, { [action.key]: null });
}

export function trackAction(action: string, data: Record<string, unknown>) {
  const newData = Object.keys(data).reduce(
    (acc, key) => ({ ...acc, [key]: data[key] ? data[key] : '1' }),
    {},
  );

  return () => FBAnalytics().logEvent(formatFirebaseEvent(action), newData);
}

export function formatFirebaseEvent(event: string) {
  return event.replace(/[-. ]/g, '_').toLowerCase();
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
    dispatch: ThunkDispatch<RootState, never, AnyAction>,
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
