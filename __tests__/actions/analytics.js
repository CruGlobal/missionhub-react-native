import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as RNOmniture from 'react-native-omniture';

import {
  trackAction, trackState, trackStepsAdded, updateAnalyticsContext,
  logInAnalytics,
} from '../../src/actions/analytics';
import { ACTIONS, ANALYTICS, ANALYTICS_CONTEXT_CHANGED, CUSTOM_STEP_TYPE, LOGGED_IN } from '../../src/constants';

jest.mock('react-native-omniture', () => {
  return {
    trackState: jest.fn(),
    trackAction: jest.fn(),
    syncIdentifier: jest.fn(),
  };
});

const screenName = 'mh : screen 1';
const mcId = '7892387873247893297847894978497823';
const ssoGuid = '74ba3670-b624-429c-8223-919b94e668fb';
const grMasterPersonId = '686fb90b-0ae8-4b0a-8e62-f7437f425c59';
let context = {
  [ANALYTICS.SCREENNAME]: screenName,
};
const mockStore = configureStore([ thunk ]);
let store;

const nameWithPrefix = (name) => `mh : ${name}`;

beforeEach(() => {
  RNOmniture.trackAction.mockReset();

  context = {
    [ANALYTICS.SCREENNAME]: screenName,
    [ANALYTICS.MCID]: mcId,
    [ANALYTICS.SSO_GUID]: ssoGuid,
  };

  store = mockStore({
    analytics: context,
    auth: {
      person: { global_registry_mdm_id: grMasterPersonId },
    },
  });
});

it('should not track state', () => {
  store.dispatch(trackState());

  expect(RNOmniture.trackState).toHaveBeenCalledTimes(0);
});

describe('updateAnalyticsContext', () => {
  it('should create action', () => {
    const result = updateAnalyticsContext(context);

    expect(result.analyticsContext).toEqual(context);
    expect(result.type).toBe(ANALYTICS_CONTEXT_CHANGED);
  });
});

describe('trackAction', () => {
  it('should track action', () => {
    const action = 'test action';
    const data = { 'property': 'action data' };

    store.dispatch(trackAction(action, data));

    expect(RNOmniture.trackAction).toHaveBeenCalledWith(action, data);
  });
});

describe('trackState', () => {
  const newScreenName = 'screen 2';
  const section = 'section';
  const subsection = 'subsection';
  const level3 = 'level 3';
  let expectedUpdatedContext;

  let trackingObj;

  beforeEach(() => {
    expectedUpdatedContext = {
      [ANALYTICS.SCREENNAME]: nameWithPrefix(newScreenName),
      [ANALYTICS.SITE_SECTION]: section,
      [ANALYTICS.SITE_SUBSECTION]: subsection,
      [ANALYTICS.SITE_SUB_SECTION_3]: level3,
      [ANALYTICS.MCID]: mcId,
      [ANALYTICS.SSO_GUID]: ssoGuid,
      [ANALYTICS.GR_MASTER_PERSON_ID]: grMasterPersonId,
    };

    trackingObj = { name: newScreenName, section: section, subsection: subsection, level3: level3 };
  });

  it('should track state', () => {
    store.dispatch(trackState(trackingObj));

    expect(RNOmniture.trackState).toHaveBeenCalledWith(nameWithPrefix(newScreenName), expectedUpdatedContext);
  });

  it('should update analytics context', () => {
    store.dispatch(trackState(trackingObj));

    expect(store.getActions()).toEqual([ {
      type: ANALYTICS_CONTEXT_CHANGED,
      analyticsContext: expectedUpdatedContext,
    } ]);
  });

  it('should not update screenname of parameter', () => {
    store.dispatch(trackState(trackingObj));

    expect(trackingObj.name).toEqual(newScreenName);
  });
});

describe('trackStepsAdded', () => {
  const step1 = { challenge_type: 'affirm', id: 1, pathway_stage: { id: 1 }, self_step: false, locale: 'en' };
  const step2 = { challenge_type: CUSTOM_STEP_TYPE, id: 2, self_step: true, locale: 'es' };
  const steps = [ step1, step2 ];

  it('should track steps', async() => {
    await store.dispatch(trackStepsAdded(steps));

    expect(store.getActions()).toEqual([]);
    expect(RNOmniture.trackAction).toHaveBeenCalledTimes(4);
    expect(RNOmniture.trackAction).toHaveBeenCalledWith(ACTIONS.STEP_DETAIL, {
      [ACTIONS.STEP_FIELDS.ID]: step1.id,
      [ACTIONS.STEP_FIELDS.STAGE]: step1.pathway_stage.id,
      [ACTIONS.STEP_FIELDS.TYPE]: step1.challenge_type,
      [ACTIONS.STEP_FIELDS.SELF]: 'N',
      [ACTIONS.STEP_FIELDS.LOCALE]: step1.locale,
    });
    expect(RNOmniture.trackAction).toHaveBeenCalledWith(ACTIONS.STEP_CREATED, {});
    expect(RNOmniture.trackAction).toHaveBeenCalledWith(ACTIONS.STEP_DETAIL, {
      [ACTIONS.STEP_FIELDS.ID]: undefined,
      [ACTIONS.STEP_FIELDS.STAGE]: undefined,
      [ACTIONS.STEP_FIELDS.TYPE]: CUSTOM_STEP_TYPE,
      [ACTIONS.STEP_FIELDS.SELF]: 'Y',
      [ACTIONS.STEP_FIELDS.LOCALE]: step2.locale,
    });
    expect(RNOmniture.trackAction).toHaveBeenCalledWith(ACTIONS.STEPS_ADDED, { 'steps': steps.length });
  });
});

describe('logInAnalytics', () => {
  beforeEach(() => store.dispatch(logInAnalytics()));

  it('should sync marketing cloud id', () => {
    expect(RNOmniture.syncIdentifier).toHaveBeenCalledWith(ssoGuid);
  });

  it('should update analytics context', () => {
    const action = store.getActions()[0];
    expect(action.type).toBe(ANALYTICS_CONTEXT_CHANGED);
    expect(action.analyticsContext[ANALYTICS.LOGGED_IN_STATUS]).toEqual(LOGGED_IN);
  });
});
