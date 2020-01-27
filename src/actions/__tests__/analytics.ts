/* eslint max-lines: 0 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import configureStore, { MockStore } from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as RNOmniture from 'react-native-omniture';

import {
  trackScreenChange,
  trackAction,
  trackStepAdded,
  updateAnalyticsContext,
  logInAnalytics,
  trackActionWithoutData,
  trackSearchFilter,
  resetAppContext,
  RESET_APP_CONTEXT,
} from '../analytics';
import {
  ACTIONS,
  ANALYTICS,
  ANALYTICS_CONTEXT_CHANGED,
  CUSTOM_STEP_TYPE,
  LOGGED_IN,
} from '../../constants';
import {
  initialAnalyticsState,
  AnalyticsState,
} from '../../reducers/analytics';

jest.mock('react-native-omniture', () => ({
  trackState: jest.fn(),
  trackAction: jest.fn(),
  loadMarketingCloudId: jest.fn(),
}));

const mockStore = configureStore([thunk]);

const mcId = '7892387873247893297847894978497823';
const ssoGuid = '74ba3670-b624-429c-8223-919b94e668fb';
const grMasterPersonId = '686fb90b-0ae8-4b0a-8e62-f7437f425c59';

let context: AnalyticsState;
let store: MockStore;

beforeEach(() => {
  context = {
    ...initialAnalyticsState,
    [ANALYTICS.MCID]: mcId,
    [ANALYTICS.SSO_GUID]: ssoGuid,
    [ANALYTICS.GR_MASTER_PERSON_ID]: grMasterPersonId,
  };
  store = mockStore({
    analytics: context,
    auth: {
      person: { global_registry_mdm_id: grMasterPersonId },
    },
  });
  (RNOmniture.trackState as jest.Mock) = jest.fn();
  (RNOmniture.trackAction as jest.Mock) = jest.fn();
  (RNOmniture.loadMarketingCloudId as jest.Mock).mockImplementation(callback =>
    callback(mcId),
  );
});

describe('resetAppContext', () => {
  it('sends reset action', () => {
    store.dispatch<any>(resetAppContext());

    expect(store.getActions()).toEqual([{ type: RESET_APP_CONTEXT }]);
  });
});

describe('trackScreenChange', () => {
  const screenNameArray = ['section', 'subsection', 'subsection 3'];
  const screenName = `mh : ${screenNameArray[0]} : ${screenNameArray[1]} : ${screenNameArray[2]}`;

  it('tracks screen change with array', () => {
    store.dispatch<any>(trackScreenChange(screenNameArray));

    expect(RNOmniture.trackState).toHaveBeenCalledWith(screenName, {
      ...context,
      [ANALYTICS.SCREEN_NAME]: screenName,
      [ANALYTICS.SITE_SECTION]: screenNameArray[0],
      [ANALYTICS.SITE_SUBSECTION]: screenNameArray[1],
      [ANALYTICS.SITE_SUBSECTION_3]: screenNameArray[2],
    });
    expect(store.getActions()).toEqual([
      {
        type: ANALYTICS_CONTEXT_CHANGED,
        analyticsContext: { [ANALYTICS.PREVIOUS_SCREEN_NAME]: screenName },
      },
    ]);
  });

  it('tracks screen change with string', () => {
    const singleScreenString = 'section';
    const shortScreenName = `mh : ${singleScreenString}`;

    store.dispatch<any>(trackScreenChange(singleScreenString));

    expect(RNOmniture.trackState).toHaveBeenCalledWith(shortScreenName, {
      ...context,
      [ANALYTICS.SCREEN_NAME]: shortScreenName,
      [ANALYTICS.SITE_SECTION]: singleScreenString,
      [ANALYTICS.SITE_SUBSECTION]: undefined,
      [ANALYTICS.SITE_SUBSECTION_3]: undefined,
    });
    expect(store.getActions()).toEqual([
      {
        type: ANALYTICS_CONTEXT_CHANGED,
        analyticsContext: { [ANALYTICS.PREVIOUS_SCREEN_NAME]: shortScreenName },
      },
    ]);
  });

  it('fetches new MCID, then tracks screen change', () => {
    store = mockStore({
      analytics: {
        ...context,
        [ANALYTICS.MCID]: '',
      },
      auth: {
        person: { global_registry_mdm_id: grMasterPersonId },
      },
    });

    store.dispatch<any>(trackScreenChange(screenNameArray));

    expect(RNOmniture.loadMarketingCloudId).toHaveBeenCalledTimes(1);
    expect(RNOmniture.trackState).toHaveBeenCalledWith(screenName, {
      ...context,
      [ANALYTICS.SCREEN_NAME]: screenName,
      [ANALYTICS.SITE_SECTION]: screenNameArray[0],
      [ANALYTICS.SITE_SUBSECTION]: screenNameArray[1],
      [ANALYTICS.SITE_SUBSECTION_3]: screenNameArray[2],
    });
    expect(store.getActions()).toEqual([
      {
        type: ANALYTICS_CONTEXT_CHANGED,
        analyticsContext: { [ANALYTICS.PREVIOUS_SCREEN_NAME]: screenName },
      },
    ]);
  });
});

describe('updateAnalyticsContext', () => {
  it('should create action', () => {
    store.dispatch(updateAnalyticsContext(context));

    expect(store.getActions()).toEqual([
      {
        type: ANALYTICS_CONTEXT_CHANGED,
        analyticsContext: context,
      },
    ]);
  });
});

describe('trackActionWithoutData', () => {
  it('should send the key with a value of 1', () => {
    const action = { name: 'hello world', key: 'cru.helloworld' };

    store.dispatch<any>(trackActionWithoutData(action));

    expect(RNOmniture.trackAction).toHaveBeenCalledWith(action.name, {
      [action.key]: '1',
    });
  });
});

describe('trackSearchFilter', () => {
  it('should track label and two keys', () => {
    const label = 'hello label';

    store.dispatch<any>(trackSearchFilter(label));

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

    store.dispatch<any>(trackAction(action, data));

    expect(RNOmniture.trackAction).toHaveBeenCalledWith(action, data);
  });

  it('should convert null values to 1', () => {
    const action = 'test action';
    const data = { property1: null, property2: 'hello', property3: null };

    store.dispatch<any>(trackAction(action, data));

    expect(RNOmniture.trackAction).toHaveBeenCalledWith(action, {
      property1: '1',
      property2: 'hello',
      property3: '1',
    });
  });
});

describe('trackStepAdded', () => {
  it('should track suggested steps', async () => {
    const step = {
      challenge_type: 'affirm',
      id: '1',
      pathway_stage: {
        id: '1',
        name: 'name',
        description: 'description',
        self_followup_description: 'description',
        position: 1,
        name_i18n: 'name',
        description_i18n: 'description',
        icon_url: 'www.missionhub.com',
        localized_pathway_stages: [],
      },
      self_step: false,
      locale: 'en',
      body: 'body',
    };
    await store.dispatch<any>(trackStepAdded(step));

    expect(store.getActions()).toEqual([]);
    expect(RNOmniture.trackAction).toHaveBeenCalledTimes(2);
    expect(RNOmniture.trackAction).toHaveBeenCalledWith(
      ACTIONS.STEP_DETAIL.name,
      {
        [ACTIONS.STEP_DETAIL
          .key]: `${step.challenge_type} | N | ${step.locale} | ${step.id} | ${step.pathway_stage.id}`,
      },
    );
    expect(RNOmniture.trackAction).toHaveBeenCalledWith(
      ACTIONS.STEPS_ADDED.name,
      { [ACTIONS.STEPS_ADDED.key]: 1 },
    );
  });

  it('should track custom steps', async () => {
    const step = {
      challenge_type: CUSTOM_STEP_TYPE,
      id: '2',
      pathway_stage: {
        id: '1',
        name: 'name',
        description: 'description',
        self_followup_description: 'description',
        position: 1,
        name_i18n: 'name',
        description_i18n: 'description',
        icon_url: 'www.missionhub.com',
        localized_pathway_stages: [],
      },
      self_step: true,
      locale: 'es',
      body: 'body',
    };
    await store.dispatch<any>(trackStepAdded(step));

    expect(store.getActions()).toEqual([]);
    expect(RNOmniture.trackAction).toHaveBeenCalledTimes(3);
    expect(RNOmniture.trackAction).toHaveBeenCalledWith(
      ACTIONS.STEP_CREATED.name,
      { [ACTIONS.STEP_CREATED.key]: '1' },
    );
    expect(RNOmniture.trackAction).toHaveBeenCalledWith(
      ACTIONS.STEP_DETAIL.name,
      {
        [ACTIONS.STEP_DETAIL.key]: `${CUSTOM_STEP_TYPE} | Y | ${step.locale}`,
      },
    );
    expect(RNOmniture.trackAction).toHaveBeenCalledWith(
      ACTIONS.STEPS_ADDED.name,
      { [ACTIONS.STEPS_ADDED.key]: 1 },
    );
  });
});

describe('logInAnalytics', () => {
  beforeEach(() => store.dispatch<any>(logInAnalytics()));

  it('should update analytics context', () => {
    const action = store.getActions()[0];
    expect(action.type).toBe(ANALYTICS_CONTEXT_CHANGED);
    expect(action.analyticsContext[ANALYTICS.LOGGED_IN_STATUS]).toEqual(
      LOGGED_IN,
    );
  });
});
