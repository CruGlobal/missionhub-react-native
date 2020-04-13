/* eslint max-lines: 0 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import configureStore, { MockStore } from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as RNOmniture from 'react-native-omniture';
import i18next from 'i18next';

import {
  trackScreenChange,
  trackAction,
  trackStepAdded,
  updateAnalyticsContext,
  logInAnalytics,
  trackActionWithoutData,
  trackSearchFilter,
  ANALYTICS_CONTEXT_CHANGED,
  ScreenContext,
} from '../analytics';
import { STEP_ADDED_ANALYTICS_FRAGMENT } from '../analyticsQueries';
import {
  ACTIONS,
  LOGGED_IN,
  ANALYTICS_MCID,
  ANALYTICS_SSO_GUID,
  ANALYTICS_GR_MASTER_PERSON_ID,
  ANALYTICS_SCREEN_NAME,
  ANALYTICS_SITE_SECTION,
  ANALYTICS_SITE_SUBSECTION,
  ANALYTICS_SITE_SUBSECTION_3,
  ANALYTICS_PREVIOUS_SCREEN_NAME,
  ANALYTICS_LOGGED_IN_STATUS,
  ANALYTICS_ASSIGNMENT_TYPE,
  ANALYTICS_EDIT_MODE,
  ANALYTICS_SECTION_TYPE,
  ANALYTICS_PERMISSION_TYPE,
} from '../../constants';
import {
  initialAnalyticsState,
  AnalyticsState,
} from '../../reducers/analytics';
import { StepTypeEnum } from '../../../__generated__/globalTypes';
import { mockFragment } from '../../../testUtils/apolloMockClient';
import { StepAddedAnalytics } from '../__generated__/StepAddedAnalytics';

jest.mock('react-native-omniture', () => ({
  trackState: jest.fn(),
  trackAction: jest.fn(),
  loadMarketingCloudId: jest.fn(),
}));

const mockStore = configureStore([thunk]);

const myId = '1';
const mcId = '7892387873247893297847894978497823';
const ssoGuid = '74ba3670-b624-429c-8223-919b94e668fb';
const grMasterPersonId = '686fb90b-0ae8-4b0a-8e62-f7437f425c59';

let analyticsContext: AnalyticsState;
let screenContext: ScreenContext;
let store: MockStore;

beforeEach(() => {
  analyticsContext = {
    ...initialAnalyticsState,
    [ANALYTICS_MCID]: mcId,
    [ANALYTICS_SSO_GUID]: ssoGuid,
    [ANALYTICS_GR_MASTER_PERSON_ID]: grMasterPersonId,
  } as AnalyticsState;
  screenContext = {
    [ANALYTICS_ASSIGNMENT_TYPE]: '',
    [ANALYTICS_EDIT_MODE]: '',
    [ANALYTICS_PERMISSION_TYPE]: '',
    [ANALYTICS_SECTION_TYPE]: '',
  };
  store = mockStore({
    analytics: analyticsContext,
    auth: {
      person: { id: myId, global_registry_mdm_id: grMasterPersonId },
    },
  });
  (RNOmniture.trackState as jest.Mock) = jest.fn();
  (RNOmniture.trackAction as jest.Mock) = jest.fn();
  (RNOmniture.loadMarketingCloudId as jest.Mock).mockImplementation(callback =>
    callback(mcId),
  );
});

describe('trackScreenChange', () => {
  const screenNameArray = ['section', 'subsection', 'subsection 3'];
  const screenName = `mh : ${screenNameArray[0]} : ${screenNameArray[1]} : ${screenNameArray[2]}`;

  it('tracks screen change with array', () => {
    store.dispatch<any>(trackScreenChange(screenNameArray));

    expect(RNOmniture.trackState).toHaveBeenCalledWith(screenName, {
      ...analyticsContext,
      ...screenContext,
      [ANALYTICS_SCREEN_NAME]: screenName,
      [ANALYTICS_SITE_SECTION]: screenNameArray[0],
      [ANALYTICS_SITE_SUBSECTION]: screenNameArray[1],
      [ANALYTICS_SITE_SUBSECTION_3]: screenNameArray[2],
    });
    expect(store.getActions()).toEqual([
      {
        type: ANALYTICS_CONTEXT_CHANGED,
        analyticsContext: { [ANALYTICS_PREVIOUS_SCREEN_NAME]: screenName },
      },
    ]);
  });

  it('tracks screen change with string', () => {
    const singleScreenString = 'section';
    const shortScreenName = `mh : ${singleScreenString}`;

    store.dispatch<any>(trackScreenChange(singleScreenString));

    expect(RNOmniture.trackState).toHaveBeenCalledWith(shortScreenName, {
      ...analyticsContext,
      ...screenContext,
      [ANALYTICS_SCREEN_NAME]: shortScreenName,
      [ANALYTICS_SITE_SECTION]: singleScreenString,
      [ANALYTICS_SITE_SUBSECTION]: undefined,
      [ANALYTICS_SITE_SUBSECTION_3]: undefined,
    });
    expect(store.getActions()).toEqual([
      {
        type: ANALYTICS_CONTEXT_CHANGED,
        analyticsContext: { [ANALYTICS_PREVIOUS_SCREEN_NAME]: shortScreenName },
      },
    ]);
  });

  it('tracks screen change with string and screen context', () => {
    const singleScreenString = 'section';
    const shortScreenName = `mh : ${singleScreenString}`;
    const extraContext: ScreenContext = {
      [ANALYTICS_ASSIGNMENT_TYPE]: 'self',
      [ANALYTICS_EDIT_MODE]: 'update',
      [ANALYTICS_PERMISSION_TYPE]: 'owner',
      [ANALYTICS_SECTION_TYPE]: 'onboarding',
    };

    store.dispatch<any>(trackScreenChange(singleScreenString, extraContext));

    expect(RNOmniture.trackState).toHaveBeenCalledWith(shortScreenName, {
      ...analyticsContext,
      ...extraContext,
      [ANALYTICS_SCREEN_NAME]: shortScreenName,
      [ANALYTICS_SITE_SECTION]: singleScreenString,
      [ANALYTICS_SITE_SUBSECTION]: undefined,
      [ANALYTICS_SITE_SUBSECTION_3]: undefined,
    });
    expect(store.getActions()).toEqual([
      {
        type: ANALYTICS_CONTEXT_CHANGED,
        analyticsContext: {
          [ANALYTICS_PREVIOUS_SCREEN_NAME]: shortScreenName,
        },
      },
    ]);
  });

  it('fetches new MCID, then tracks screen change', () => {
    store = mockStore({
      analytics: {
        ...analyticsContext,
        ...screenContext,
        [ANALYTICS_MCID]: '',
      },
      auth: {
        person: { global_registry_mdm_id: grMasterPersonId },
      },
    });

    store.dispatch<any>(trackScreenChange(screenNameArray));

    expect(RNOmniture.loadMarketingCloudId).toHaveBeenCalledTimes(1);
    expect(RNOmniture.trackState).toHaveBeenCalledWith(screenName, {
      ...analyticsContext,
      ...screenContext,
      [ANALYTICS_SCREEN_NAME]: screenName,
      [ANALYTICS_SITE_SECTION]: screenNameArray[0],
      [ANALYTICS_SITE_SUBSECTION]: screenNameArray[1],
      [ANALYTICS_SITE_SUBSECTION_3]: screenNameArray[2],
    });
    expect(store.getActions()).toEqual([
      {
        type: ANALYTICS_CONTEXT_CHANGED,
        analyticsContext: { [ANALYTICS_PREVIOUS_SCREEN_NAME]: screenName },
      },
    ]);
  });
});

describe('updateAnalyticsContext', () => {
  it('should create action', () => {
    store.dispatch(updateAnalyticsContext(analyticsContext));

    expect(store.getActions()).toEqual([
      {
        type: ANALYTICS_CONTEXT_CHANGED,
        analyticsContext,
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
    await store.dispatch<any>(
      trackStepAdded(
        mockFragment<StepAddedAnalytics>(STEP_ADDED_ANALYTICS_FRAGMENT, {
          mocks: {
            Step: () => ({
              stepType: () => StepTypeEnum.share,
              receiver: () => ({ id: '2' }), // non me id
            }),
          },
        }),
      ),
    );

    expect(store.getActions()).toEqual([]);
    expect(RNOmniture.trackAction).toHaveBeenCalledTimes(2);
    expect(RNOmniture.trackAction).toHaveBeenCalledWith(
      ACTIONS.STEP_DETAIL.name,
      {
        [ACTIONS.STEP_DETAIL
          .key]: `${StepTypeEnum.share} | N | ${i18next.language} | 1 | 2`,
      },
    );
    expect(RNOmniture.trackAction).toHaveBeenCalledWith(
      ACTIONS.STEPS_ADDED.name,
      { [ACTIONS.STEPS_ADDED.key]: 1 },
    );
  });

  it('should track custom steps', async () => {
    await store.dispatch<any>(
      trackStepAdded(
        mockFragment<StepAddedAnalytics>(STEP_ADDED_ANALYTICS_FRAGMENT, {
          mocks: {
            Step: () => ({
              stepType: () => StepTypeEnum.share,
              stepSuggestion: () => null,
              receiver: () => ({ id: myId }),
            }),
          },
        }),
      ),
    );

    expect(store.getActions()).toEqual([]);
    expect(RNOmniture.trackAction).toHaveBeenCalledTimes(3);
    expect(RNOmniture.trackAction).toHaveBeenCalledWith(
      ACTIONS.STEP_CREATED.name,
      { [ACTIONS.STEP_CREATED.key]: '1' },
    );
    expect(RNOmniture.trackAction).toHaveBeenCalledWith(
      ACTIONS.STEP_DETAIL.name,
      {
        [ACTIONS.STEP_DETAIL
          .key]: `${StepTypeEnum.share} | Y | ${i18next.language}`,
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
    expect(action.analyticsContext[ANALYTICS_LOGGED_IN_STATUS]).toEqual(
      LOGGED_IN,
    );
  });
});
