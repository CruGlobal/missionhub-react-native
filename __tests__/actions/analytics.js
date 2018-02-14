import { ANALYTICS, ANALYTICS_CONTEXT_CHANGED } from '../../src/constants';
import { trackAction, trackState, updateAnalyticsContext, updateLoggedInStatus } from '../../src/actions/analytics';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as RNOmniture from 'react-native-omniture';

jest.mock('react-native-omniture', () => {
  return {
    trackState: jest.fn(),
    trackAction: jest.fn(),
    syncMarketingCloudId: jest.fn(),
  };
});

const screenName = 'mh : screen 1';
const mcId = '7892387873247893297847894978497823';
let context = {
  [ANALYTICS.SCREENNAME]: screenName,
};
const mockStore = configureStore([ thunk ]);
let store;

const nameWithPrefix = (name) => `mh : ${name}`;

beforeEach(() => {
  context = {
    [ANALYTICS.SCREENNAME]: screenName,
    [ANALYTICS.MCID]: mcId,
  };

  store = mockStore({
    analytics: context,
  });
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
      [ANALYTICS.PAGE_NAME]: nameWithPrefix(newScreenName),
      [ANALYTICS.SITE_SECTION]: section,
      [ANALYTICS.SITE_SUBSECTION]: subsection,
      [ANALYTICS.SITE_SUB_SECTION_3]: level3,
      [ANALYTICS.MCID]: mcId,
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

describe('updateLoggedInStatus', () => {
  const status = true;

  beforeEach(() => store.dispatch(updateLoggedInStatus(status)));

  it('should sync marketing cloud id', () => {
    expect(RNOmniture.syncMarketingCloudId).toHaveBeenCalledWith(mcId);
  });

  it('should update analytics context', () => {
    const action = store.getActions()[0];
    expect(action.type).toBe(ANALYTICS_CONTEXT_CHANGED);
    expect(action.analyticsContext[ANALYTICS.LOGGED_IN_STATUS]).toEqual(status);
  });
});
