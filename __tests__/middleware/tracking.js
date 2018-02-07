import configureStore from 'redux-mock-store';
import { ANALYTICS } from '../../src/constants';
import tracking from '../../src/middleware/tracking';
import { mockFnWithParams } from '../../testUtils';
import * as analytics from '../../src/actions/analytics';
import { trackableScreens } from '../../src/AppRoutes';

const mockStore = configureStore([ tracking ]);
let store;

const routeName = 'test route';
const analyticsName = 'test : middleware';
const navigate = { type: 'Navigation/NAVIGATE', routeName: routeName };

const back = { type: 'Navigation/BACK' };

const trackStateResult = { type: 'tracked state' };

it('tracks screenname when navigating', () => {
  trackableScreens[routeName] = { name: analyticsName };
  store = mockStore();
  mockFnWithParams(analytics, 'trackState', trackStateResult, analyticsName);

  store.dispatch(navigate);

  expect(store.getActions()).toEqual([ navigate, trackStateResult ]);
});

it('tracks previous screenname when navigating back', () => {
  const prevScreenName = 'prev screen';
  store = mockStore({ analytics: { [ANALYTICS.PREVIOUS_SCREENNAME]: prevScreenName } });
  mockFnWithParams(analytics, 'trackState', trackStateResult, prevScreenName);

  store.dispatch(back);

  // expect(store.getActions()).toEqual([ back, trackStateResult ]);
});

