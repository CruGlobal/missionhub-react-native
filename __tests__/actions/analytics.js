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

const screenName = 'mh : section : screen';
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
  const section = 'section';
  const subsection = 'subsection';
  const screenNameWithSection = `${section} : screen`;

  let expectedUpdatedContext;

  beforeEach(() => {
    store.dispatch(trackState(screenNameWithSection));

    expectedUpdatedContext = {
      [ANALYTICS.PREVIOUS_SCREENNAME]: screenName,
      [ANALYTICS.SCREENNAME]: nameWithPrefix(screenNameWithSection),
      [ANALYTICS.PAGE_NAME]: nameWithPrefix(screenNameWithSection),
      [ANALYTICS.SITE_SECTION]: section,
      [ANALYTICS.MCID]: mcId,
    };
  });

  it('should track state', () => {
    store.dispatch(trackState(screenNameWithSection));

    expect(RNOmniture.trackState).toHaveBeenCalledWith(nameWithPrefix(screenNameWithSection), expect.anything());
  });

  it('should send updated analytics context with site section', () => {
    store.dispatch(trackState(screenNameWithSection));

    expect(RNOmniture.trackState).toHaveBeenCalledWith(expect.anything(), expectedUpdatedContext);
  });

  it('should send updated analytics context with site section and subsection', () => {
    const screenNameWithSubsection = `${section} : ${subsection} : screen`;
    expectedUpdatedContext[ANALYTICS.SCREENNAME] = nameWithPrefix(screenNameWithSubsection);
    expectedUpdatedContext[ANALYTICS.PAGE_NAME] = nameWithPrefix(screenNameWithSubsection);
    expectedUpdatedContext[ANALYTICS.SITE_SUBSECTION] = subsection;

    store.dispatch(trackState(screenNameWithSubsection));

    expect(RNOmniture.trackState).toHaveBeenCalledWith(expect.anything(), expectedUpdatedContext);
  });

  it('should send updated analytics context with site section, subsection, and subsection level 3', () => {
    const sectionLevel3 = 'section level 3';
    const screenNameWithSubsectionAndLevel3 = `${section} : ${subsection} : ${sectionLevel3} : screen`;
    expectedUpdatedContext[ANALYTICS.SCREENNAME] = nameWithPrefix(screenNameWithSubsectionAndLevel3);
    expectedUpdatedContext[ANALYTICS.PAGE_NAME] = nameWithPrefix(screenNameWithSubsectionAndLevel3);
    expectedUpdatedContext[ANALYTICS.SITE_SUBSECTION] = subsection;
    expectedUpdatedContext[ANALYTICS.SITE_SUB_SECTION_3] = sectionLevel3;

    store.dispatch(trackState(screenNameWithSubsectionAndLevel3));

    expect(RNOmniture.trackState).toHaveBeenCalledWith(expect.anything(), expectedUpdatedContext);
  });

  it('should update analytics context', () => {
    store.dispatch(trackState(screenNameWithSection));

    const action = store.getActions()[0];
    expect(action.type).toBe(ANALYTICS_CONTEXT_CHANGED);
    expect(action.analyticsContext).toEqual(expectedUpdatedContext);
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
