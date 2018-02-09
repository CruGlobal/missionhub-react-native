import configureStore from 'redux-mock-store';
import { ANALYTICS, CONTACT_MENU_DRAWER, DRAWER_OPEN, MAIN_MENU_DRAWER, NAVIGATE_FORWARD } from '../../src/constants';
import tracking from '../../src/middleware/tracking';
import { mockFnWithParams } from '../../testUtils';
import * as analytics from '../../src/actions/analytics';
import { trackableScreens } from '../../src/AppRoutes';

const mockStore = configureStore([ tracking ]);
let store;

const routeName = 'test route';
let screenName = 'test : middleware';
let navigationAction;

const back = { type: 'Navigation/BACK' };

const trackStateResult = { type: 'tracked state' };

describe('navigate forward', () => {
  beforeEach(() => {
    store = mockStore();
  });

  it('tracks screenname when navigating', () => {
    screenName = 'test : forward';
    navigationAction = { type: NAVIGATE_FORWARD, routeName: routeName };
    trackableScreens[routeName] = { name: screenName };
    mockFnWithParams(analytics, 'trackState', trackStateResult, screenName);

    store.dispatch(navigationAction);

    expect(store.getActions()).toEqual([ navigationAction, trackStateResult ]);
  });

  describe('drawers', () => {
    beforeEach(() => {
      navigationAction = { type: NAVIGATE_FORWARD, routeName: DRAWER_OPEN, params: { drawer: MAIN_MENU_DRAWER } };
    });

    it('tracks main menu drawer', () => {
      screenName = 'menu : menu';
      navigationAction.params = { drawer: MAIN_MENU_DRAWER };
      mockFnWithParams(analytics, 'trackState', trackStateResult, screenName);

      store.dispatch(navigationAction);

      expect(store.getActions()).toEqual([ navigationAction, trackStateResult ]);
    });

    describe('contact drawer', () => {
      it('tracks self menu', () => {
        screenName = 'people : person : menu : menu';
        navigationAction.params = { drawer: CONTACT_MENU_DRAWER, isCurrentUser: false };
        mockFnWithParams(analytics, 'trackState', trackStateResult, screenName);

        store.dispatch(navigationAction);

        expect(store.getActions()).toEqual([ navigationAction, trackStateResult ]);
      });

      it('tracks person menu', () => {
        screenName = 'people : self : menu : menu';
        navigationAction.params = { drawer: CONTACT_MENU_DRAWER, isCurrentUser: true };
        mockFnWithParams(analytics, 'trackState', trackStateResult, screenName);

        store.dispatch(navigationAction);

        expect(store.getActions()).toEqual([ navigationAction, trackStateResult ]);
      });
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

