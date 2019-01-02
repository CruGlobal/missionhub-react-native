import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as RNOmniture from 'react-native-omniture';
import { Tracker } from '@ringierag/snowplow-reactjs-native-tracker';

import {
  trackAction,
  trackState,
  trackStepsAdded,
  updateAnalyticsContext,
  logInAnalytics,
  trackActionWithoutData,
  trackSearchFilter,
  // emitterCallback,
} from '../analytics';
import {
  ACTIONS,
  ANALYTICS,
  ANALYTICS_CONTEXT_CHANGED,
  CUSTOM_STEP_TYPE,
  LOGGED_IN,
} from '../../constants';

const mockTracker = {
  trackScreenView: jest.fn(),
  core: {
    addPayloadPair: jest.fn(),
  },
};

jest.mock('@ringierag/snowplow-reactjs-native-tracker', () => ({
  Emitter: jest.fn(),
  Tracker: jest.fn(() => mockTracker),
}));
jest.mock('react-native-config', () => ({
  SNOWPLOW_URL: 'mock snowplow url',
  SNOWPLOW_APP_ID: 'mock snowplow app id',
}));

const screenName = 'mh : screen 1';
const mcId = '7892387873247893297847894978497823';
const ssoGuid = '74ba3670-b624-429c-8223-919b94e668fb';
const grMasterPersonId = '686fb90b-0ae8-4b0a-8e62-f7437f425c59';
let context = {
  [ANALYTICS.SCREENNAME]: screenName,
};
const mockStore = configureStore([thunk]);
let store;

const nameWithPrefix = name => `mh : ${name}`;

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

describe('updateAnalyticsContext', () => {
  it('should create action', () => {
    const result = updateAnalyticsContext(context);

    expect(result.analyticsContext).toEqual(context);
    expect(result.type).toBe(ANALYTICS_CONTEXT_CHANGED);
  });
});

describe('trackActionWithoutData', () => {
  it('should send the key with a value of 1', () => {
    const action = { name: 'hello world', key: 'cru.helloworld' };

    store.dispatch(trackActionWithoutData(action));

    expect(RNOmniture.trackAction).toHaveBeenCalledWith(action.name, {
      [action.key]: '1',
    });
  });
});

describe('trackSearchFilter', () => {
  it('should track label and two keys', () => {
    const label = 'hello label';

    store.dispatch(trackSearchFilter(label));

    expect(RNOmniture.trackAction).toHaveBeenCalledWith(
      ACTIONS.FILTER_ENGAGED.name,
      {
        [ACTIONS.SEARCH_FILTER.key]: label,
        [ACTIONS.FILTER_ENGAGED.key]: '1',
      },
    );
  });
});

describe('trackAction', () => {
  it('should track action', () => {
    const action = 'test action';
    const data = { property: 'action data' };

    store.dispatch(trackAction(action, data));

    expect(RNOmniture.trackAction).toHaveBeenCalledWith(action, data);
  });

  it('should convert null values to 1', () => {
    const action = 'test action';
    const data = { property1: null, property2: 'hello', property3: null };

    store.dispatch(trackAction(action, data));

    expect(RNOmniture.trackAction).toHaveBeenCalledWith(action, {
      property1: '1',
      property2: 'hello',
      property3: '1',
    });
  });
});

describe('trackState', () => {
  const newScreenName = 'screen 2';
  const section = 'section';
  const subsection = 'subsection';
  const level3 = 'level 3';
  const level4 = 'level 4';
  let expectedUpdatedContext;

  let trackingObj;

  beforeEach(() => {
    expectedUpdatedContext = {
      [ANALYTICS.SCREENNAME]: nameWithPrefix(newScreenName),
      [ANALYTICS.SITE_SECTION]: section,
      [ANALYTICS.SITE_SUBSECTION]: subsection,
      [ANALYTICS.SITE_SUB_SECTION_3]: level3,
      [ANALYTICS.SITE_SUB_SECTION_4]: level4,
      [ANALYTICS.MCID]: mcId,
      [ANALYTICS.SSO_GUID]: ssoGuid,
      [ANALYTICS.GR_MASTER_PERSON_ID]: grMasterPersonId,
    };

    trackingObj = {
      name: newScreenName,
      section: section,
      subsection: subsection,
      level3: level3,
      level4: level4,
    };
  });

  /*  afterEach(() =>
    expect(Emitter).toHaveBeenCalledWith(
      'mock snowplow url',
      'https',
      443,
      'POST',
      1,
      expect.any(Function),
    ));*/

  it('should not track state with no argument', () => {
    store.dispatch(trackState());

    expect(Tracker).not.toHaveBeenCalled();
    expect(RNOmniture.trackState).toHaveBeenCalledTimes(0);
  });

  it('should track state', () => {
    store.dispatch(trackState(trackingObj));

    /*    expect(Tracker).toHaveBeenCalledWith(
      [{}],
      null,
      'mock snowplow app id',
      true,
    );
    expect(mockTracker.trackScreenView).toHaveBeenCalledWith(
      nameWithPrefix(trackingObj.name),
      null,
      [
        {
          schema: ID_SCHEMA,
          data: {
            gr_master_person_id: grMasterPersonId,
            sso_guid: ssoGuid,
            mcid: mcId,
          },
        },
      ],
    );
    expect(mockTracker.core.addPayloadPair).toHaveBeenCalledWith(
      'url',
      nameWithPrefix(trackingObj.name),
    );*/
    expect(RNOmniture.trackState).toHaveBeenCalledWith(
      nameWithPrefix(newScreenName),
      expectedUpdatedContext,
    );
  });

  it('should update analytics context', () => {
    store.dispatch(trackState(trackingObj));

    expect(store.getActions()).toEqual([
      {
        type: ANALYTICS_CONTEXT_CHANGED,
        analyticsContext: expectedUpdatedContext,
      },
    ]);
  });

  it('should not update screenname of parameter', () => {
    store.dispatch(trackState(trackingObj));

    expect(trackingObj.name).toEqual(newScreenName);
  });

  it('should load MCID before sending request if MCID is not set', () => {
    const mcid = '100';
    RNOmniture.loadMarketingCloudId.mockImplementation(callback =>
      callback(mcid),
    );
    store = mockStore({
      analytics: {},
      auth: { person: {} },
    });

    store.dispatch(trackState(trackingObj));

    /*    expect(Tracker).toHaveBeenCalledWith(
      [{}],
      null,
      'mock snowplow app id',
      true,
    );
    expect(mockTracker.trackScreenView).toHaveBeenCalledWith(
      nameWithPrefix(trackingObj.name),
      null,
      [
        {
          schema: ID_SCHEMA,
          data: {
            gr_master_person_id: undefined,
            sso_guid: undefined,
            mcid: mcid,
          },
        },
      ],
    );*/
    expect(RNOmniture.trackState).toHaveBeenCalledWith(
      nameWithPrefix(trackingObj.name),
      expect.objectContaining({
        [ANALYTICS.SCREENNAME]: nameWithPrefix(trackingObj.name),
        [ANALYTICS.MCID]: mcid,
      }),
    );
    expect(store.getActions()).toEqual([
      expect.anything(),
      {
        analyticsContext: {
          [ANALYTICS.SCREENNAME]: nameWithPrefix(trackingObj.name),
          [ANALYTICS.SITE_SECTION]: trackingObj.section,
          [ANALYTICS.SITE_SUBSECTION]: trackingObj.subsection,
          [ANALYTICS.SITE_SUB_SECTION_3]: trackingObj.level3,
          [ANALYTICS.SITE_SUB_SECTION_4]: level4,

          [ANALYTICS.MCID]: mcid,
        },
        type: ANALYTICS_CONTEXT_CHANGED,
      },
    ]);
  });

  // xdescribe('emitterCallback', () => {
  //   beforeEach(() => expect.assertions(2)); //afterEach callback

  //   it('should return a rejected promise if an error is returned', async () => {
  //     const errorObj = { error: 'some error' };
  //     try {
  //       await emitterCallback(errorObj);
  //     } catch (error) {
  //       expect(error).toEqual({ snowplowError: errorObj });
  //     }
  //   });

  //   it('should return a rejected promise if a response code other than 200 is returned', async () => {
  //     const responseObj = { response: 'some response', status: 400 };
  //     try {
  //       await emitterCallback(responseObj);
  //     } catch (error) {
  //       expect(error).toEqual({ snowplowError: responseObj });
  //     }
  //   });
  // });
});

describe('trackStepsAdded', () => {
  const step1 = {
    challenge_type: 'affirm',
    id: 1,
    pathway_stage: { id: 1 },
    self_step: false,
    locale: 'en',
  };
  const step2 = {
    challenge_type: CUSTOM_STEP_TYPE,
    id: 2,
    self_step: true,
    locale: 'es',
  };
  const steps = [step1, step2];

  it('should track steps', async () => {
    await store.dispatch(trackStepsAdded(steps));

    expect(store.getActions()).toEqual([]);
    expect(RNOmniture.trackAction).toHaveBeenCalledTimes(4);
    expect(RNOmniture.trackAction).toHaveBeenCalledWith(
      ACTIONS.STEP_DETAIL.name,
      {
        [ACTIONS.STEP_DETAIL.key]: `${step1.challenge_type} | N | ${
          step1.locale
        } | ${step1.id} | ${step1.pathway_stage.id}`,
      },
    );
    expect(RNOmniture.trackAction).toHaveBeenCalledWith(
      ACTIONS.STEP_CREATED.name,
      { [ACTIONS.STEP_CREATED.key]: '1' },
    );
    expect(RNOmniture.trackAction).toHaveBeenCalledWith(
      ACTIONS.STEP_DETAIL.name,
      {
        [ACTIONS.STEP_DETAIL.key]: `${CUSTOM_STEP_TYPE} | Y | ${step2.locale}`,
      },
    );
    expect(RNOmniture.trackAction).toHaveBeenCalledWith(
      ACTIONS.STEPS_ADDED.name,
      { [ACTIONS.STEPS_ADDED.key]: steps.length },
    );
  });
});

describe('logInAnalytics', () => {
  beforeEach(() => store.dispatch(logInAnalytics()));

  it('should update analytics context', () => {
    const action = store.getActions()[0];
    expect(action.type).toBe(ANALYTICS_CONTEXT_CHANGED);
    expect(action.analyticsContext[ANALYTICS.LOGGED_IN_STATUS]).toEqual(
      LOGGED_IN,
    );
  });
});
