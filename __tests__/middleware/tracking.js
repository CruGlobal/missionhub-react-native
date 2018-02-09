import configureStore from 'redux-mock-store';
import { ANALYTICS, CONTACT_MENU_DRAWER, DRAWER_OPEN, MAIN_MENU_DRAWER } from '../../src/constants';
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

describe('navigate forward', () => {
  it('tracks screenname when navigating', () => {
    trackableScreens[routeName] = { name: analyticsName };
    store = mockStore();
    mockFnWithParams(analytics, 'trackState', trackStateResult, analyticsName);

    store.dispatch(navigate);

    expect(store.getActions()).toEqual([ navigate, trackStateResult ]);
  });

  it('tracks main menu drawer', () => {
    const screenName = 'menu : menu';
    const navigate = { type: 'Navigation/NAVIGATE', routeName: DRAWER_OPEN, params: { drawer: MAIN_MENU_DRAWER } };
    store = mockStore();
    mockFnWithParams(analytics, 'trackState', trackStateResult, screenName);

    store.dispatch(navigate);

    expect(store.getActions()).toEqual([ navigate, trackStateResult ]);
  });

  describe('contact drawer', () => {
    it('tracks self menu', () => {
      const screenName = 'people : person : menu : menu';
      const navigate = { type: 'Navigation/NAVIGATE', routeName: DRAWER_OPEN, params: { drawer: CONTACT_MENU_DRAWER, isCurrentUser: false } };
      store = mockStore();
      mockFnWithParams(analytics, 'trackState', trackStateResult, screenName);

      store.dispatch(navigate);

      expect(store.getActions()).toEqual([ navigate, trackStateResult ]);
    });

    it('tracks person menu', () => {
      const screenName = 'people : self : menu : menu';
      const navigate = { type: 'Navigation/NAVIGATE', routeName: DRAWER_OPEN, params: { drawer: CONTACT_MENU_DRAWER, isCurrentUser: true } };
      store = mockStore();
      mockFnWithParams(analytics, 'trackState', trackStateResult, screenName);

      store.dispatch(navigate);

      expect(store.getActions()).toEqual([ navigate, trackStateResult ]);
    });
  });
});


it('tracks previous screenname when navigating back', () => {
  const prevScreenName = 'prev screen';
  store = mockStore({ analytics: { [ANALYTICS.PREVIOUS_SCREENNAME]: prevScreenName } });
  mockFnWithParams(analytics, 'trackState', trackStateResult, prevScreenName);

  store.dispatch(back);

  // expect(store.getActions()).toEqual([ back, trackStateResult ]);
});

