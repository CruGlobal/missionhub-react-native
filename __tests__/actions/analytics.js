import { ANALYTICS, ANALYTICS_CONTEXT_CHANGED } from '../../src/constants';
import { trackState, updateAnalyticsContext, updateLoggedInStatus } from '../../src/actions/analytics';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as RNOmniture from 'react-native-omniture';

jest.mock('react-native-omniture', () => {
  return {
    trackState: jest.fn(),
    syncMarketingCloudId: jest.fn(),
  };
});

const screenName = 'testScreen';
const mcId = '7892387873247893297847894978497823';
let context = {
  [ANALYTICS.SCREENNAME]: screenName,
};
const mockStore = configureStore([thunk]);

beforeEach(() => {
  context = {
    [ANALYTICS.SCREENNAME]: screenName,
    [ANALYTICS.MCID]: mcId,
  };
});

describe('updateAnalyticsContext', () => {
  it('should create action', () => {
    const result = updateAnalyticsContext(context);

    expect(result.analyticsContext).toEqual(context);
    expect(result.type).toBe(ANALYTICS_CONTEXT_CHANGED);
  });
});

describe('trackState', () => {
  let store;
  const newScreenName = 'testScreen2';

  const expectedUpdatedContext = {
    [ANALYTICS.PREVIOUS_SCREENNAME]: screenName,
    [ANALYTICS.SCREENNAME]: newScreenName,
    [ANALYTICS.PAGE_NAME]: newScreenName,
    [ANALYTICS.MCID]: mcId,
  };

  beforeEach(() => {
    store = mockStore({
      analytics: context,
    });

    store.dispatch(trackState(newScreenName));
  });

  it('should track state', () => {
    expect(RNOmniture.trackState).toHaveBeenCalledWith(newScreenName, expect.anything());
  });

  it('should send updated analytics context', () => {
    expect(RNOmniture.trackState).toHaveBeenCalledWith(expect.anything(), expectedUpdatedContext);
  });

  it('should update analytics context', () => {
    const action = store.getActions()[0];
    expect(action.type).toBe(ANALYTICS_CONTEXT_CHANGED);
    expect(action.analyticsContext).toEqual(expectedUpdatedContext);
  });
});

describe('updateLoggedInStatus', () => {
  let store;
  const status = true;

  beforeEach(() => {
    store = mockStore({
      analytics: context,
    });

    store.dispatch(updateLoggedInStatus(status));
  });

  it('should sync marketing cloud id', () => {
    expect(RNOmniture.syncMarketingCloudId).toHaveBeenCalledWith(mcId);
  });

  it('should update analytics context', () => {
    const action = store.getActions()[0];
    expect(action.type).toBe(ANALYTICS_CONTEXT_CHANGED);
    expect(action.analyticsContext[ANALYTICS.LOGGED_IN_STATUS]).toEqual(status);
  });
});