/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines */

import configureStore, { MockStore } from 'redux-mock-store';
import thunk from 'redux-thunk';
import FBAnalytics from '@react-native-firebase/analytics';
import i18next from 'i18next';

import {
  trackScreenChange,
  trackAction,
  trackStepAdded,
  updateAnalyticsContext,
  logInAnalytics,
  trackActionWithoutData,
  ANALYTICS_CONTEXT_CHANGED,
  ScreenContext,
  trackStepDeleted,
  formatFirebaseEvent,
} from '../analytics';
import { STEP_ADDED_ANALYTICS_FRAGMENT } from '../analyticsQueries';
import {
  ACTIONS,
  LOGGED_IN,
  ANALYTICS_SSO_GUID,
  ANALYTICS_GR_MASTER_PERSON_ID,
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
import { getAuthPerson } from '../../auth/authUtilities';

jest.mock('react-native-omniture', () => ({
  trackState: jest.fn(),
  trackAction: jest.fn(),
  loadMarketingCloudId: jest.fn(),
}));
jest.mock('../../auth/authUtilities');

((FBAnalytics as unknown) as jest.Mock).mockReturnValue({
  logEvent: jest.fn(),
  logScreenView: jest.fn(),
  setUserProperties: jest.fn(),
});

const mockStore = configureStore([thunk]);

const myId = '1';
(getAuthPerson as jest.Mock).mockReturnValue({ id: myId });
const ssoGuid = '74ba3670-b624-429c-8223-919b94e668fb';
const grMasterPersonId = '686fb90b-0ae8-4b0a-8e62-f7437f425c59';

let analyticsContext: AnalyticsState;
let screenContext: ScreenContext;
let store: MockStore;

beforeEach(() => {
  analyticsContext = {
    ...initialAnalyticsState,
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
  });
});

describe('trackScreenChange', () => {
  const screenNameArray = ['section', 'subsection', 'subsection 3'];
  const screenName = `mh : ${screenNameArray[0]} : ${screenNameArray[1]} : ${screenNameArray[2]}`;

  it('tracks screen change with array', () => {
    store.dispatch<any>(trackScreenChange(screenNameArray));

    expect(FBAnalytics().logScreenView).toHaveBeenCalledWith({
      screen_name: screenName,
    });
  });

  it('tracks screen change with string', () => {
    const singleScreenString = 'section';
    const shortScreenName = `mh : ${singleScreenString}`;

    store.dispatch<any>(trackScreenChange(singleScreenString));

    expect(FBAnalytics().logScreenView).toHaveBeenCalledWith({
      screen_name: shortScreenName,
    });
  });

  it('tracks screen change with string and screen context', () => {
    const singleScreenString = 'section';
    const shortScreenName = `mh : ${singleScreenString}`;

    store.dispatch<any>(trackScreenChange(singleScreenString));

    expect(store.getActions()).toEqual([
      {
        type: ANALYTICS_CONTEXT_CHANGED,
        analyticsContext: {
          [ANALYTICS_PREVIOUS_SCREEN_NAME]: shortScreenName,
        },
      },
    ]);
    expect(FBAnalytics().logScreenView).toHaveBeenCalledWith({
      screen_name: 'mh : section',
    });
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
    const action = { name: 'hello_world', key: 'cru_helloworld' };

    store.dispatch<any>(trackActionWithoutData(action));

    expect(FBAnalytics().logEvent).toHaveBeenCalledWith(action.name, {
      [action.key]: '1',
    });
  });
});

describe('trackAction', () => {
  it('should track action', () => {
    const action = 'test action';
    const data = { property: 'action data' };

    store.dispatch<any>(trackAction(action, data));

    expect(FBAnalytics().logEvent).toHaveBeenCalledWith('test_action', data);
  });

  it('should convert null values to 1', () => {
    const action = 'test action';
    const data = { property1: null, property2: 'hello', property3: null };

    store.dispatch<any>(trackAction(action, data));

    expect(FBAnalytics().logEvent).toHaveBeenCalledWith('test_action', {
      property1: '1',
      property2: 'hello',
      property3: '1',
    });
  });
});

describe('trackStepAdded', () => {
  it('should track suggested steps', async () => {
    const mockStep = mockFragment<StepAddedAnalytics>(
      STEP_ADDED_ANALYTICS_FRAGMENT,
      {
        mocks: {
          Step: () => ({
            stepType: () => StepTypeEnum.share,
            post: () => null,
            receiver: () => ({ id: '2' }), // non me id
          }),
        },
      },
    );

    await store.dispatch<any>(trackStepAdded(mockStep));

    expect(store.getActions()).toEqual([]);
    expect(FBAnalytics().logEvent).toHaveBeenCalledTimes(2);
    expect(FBAnalytics().logEvent).toHaveBeenCalledWith(
      ACTIONS.STEP_DETAIL.name,
      {
        [ACTIONS.STEP_DETAIL
          .key]: `${StepTypeEnum.share} | N | ${i18next.language} | ${mockStep.stepSuggestion?.id} | ${mockStep.stepSuggestion?.stage.id}`,
      },
    );
    expect(FBAnalytics().logEvent).toHaveBeenCalledWith(
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
              post: () => null,
              receiver: () => ({ id: myId }),
            }),
          },
        }),
      ),
    );

    expect(store.getActions()).toEqual([]);
    expect(FBAnalytics().logEvent).toHaveBeenCalledTimes(3);
    expect(FBAnalytics().logEvent).toHaveBeenCalledWith(
      ACTIONS.STEP_CREATED.name,
      { [ACTIONS.STEP_CREATED.key]: '1' },
    );
    expect(FBAnalytics().logEvent).toHaveBeenCalledWith(
      ACTIONS.STEP_DETAIL.name,
      {
        [ACTIONS.STEP_DETAIL
          .key]: `${StepTypeEnum.share} | Y | ${i18next.language}`,
      },
    );
    expect(FBAnalytics().logEvent).toHaveBeenCalledWith(
      ACTIONS.STEPS_ADDED.name,
      {
        [ACTIONS.STEPS_ADDED.key]: 1,
      },
    );
  });
});

it('should track step deletion', async () => {
  await store.dispatch<any>(trackStepDeleted('Step Detail'));
  expect(store.getActions()).toEqual([]);

  expect(FBAnalytics().logEvent).toHaveBeenCalledTimes(1);
  expect(FBAnalytics().logEvent).toHaveBeenCalledWith(
    'step_removed_on_step_detail_screen',
    {
      [ACTIONS.STEP_REMOVED.key]: '1',
    },
  );
});

describe('formatFirebaseEvent', () => {
  it('should format the event name', () => {
    const event = formatFirebaseEvent('Unformated.fire-base Event');
    expect(event).toEqual('unformated_fire_base_event');
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
