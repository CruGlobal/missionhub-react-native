import configureStore from 'redux-mock-store';
import { ANALYTICS, CONTACT_MENU_DRAWER, DRAWER_OPEN, MAIN_MENU_DRAWER, NAVIGATE_FORWARD } from '../../src/constants';
import tracking from '../../src/middleware/tracking';
import { mockFnWithParams } from '../../testUtils';
import * as analytics from '../../src/actions/analytics';
import { trackableScreens } from '../../src/AppRoutes';
import { CONTACT_SCREEN } from '../../src/containers/ContactScreen';
import { PERSON_STEPS, SELF_STEPS } from '../../src/components/ContactHeader';

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

  describe('to contact screen', () => {
    it('tracks person steps', () => {
      store = mockStore({ auth: { personId: 2 } });
      navigationAction = { type: NAVIGATE_FORWARD, routeName: CONTACT_SCREEN, params: { person: { id: 1 } } };
      mockFnWithParams(analytics, 'trackState', trackStateResult, PERSON_STEPS);

      store.dispatch(navigationAction);

      expect(store.getActions()).toEqual([ navigationAction, trackStateResult ]);
    });


    it('tracks self steps', () => {
      const id = 3;
      store = mockStore({ auth: { personId: id } });
      navigationAction = { type: NAVIGATE_FORWARD, routeName: CONTACT_SCREEN, params: { person: { id: id } } };
      mockFnWithParams(analytics, 'trackState', trackStateResult, SELF_STEPS);

      store.dispatch(navigationAction);

      expect(store.getActions()).toEqual([ navigationAction, trackStateResult ]);
    });
  });

  describe('to drawer', () => {
    beforeEach(() => {
      navigationAction = { type: NAVIGATE_FORWARD, routeName: DRAWER_OPEN, params: { drawer: MAIN_MENU_DRAWER } };
    });

    it('tracks main menu drawer', () => {
      navigationAction.params = { drawer: MAIN_MENU_DRAWER };
      mockFnWithParams(analytics, 'trackState', trackStateResult, 'menu : menu');

      store.dispatch(navigationAction);

      expect(store.getActions()).toEqual([ navigationAction, trackStateResult ]);
    });

    describe('contact drawer', () => {
      it('tracks self menu', () => {
        navigationAction.params = { drawer: CONTACT_MENU_DRAWER, isCurrentUser: false };
        mockFnWithParams(analytics, 'trackState', trackStateResult, 'people : person : menu : menu');

        store.dispatch(navigationAction);

        expect(store.getActions()).toEqual([ navigationAction, trackStateResult ]);
      });

      it('tracks person menu', () => {
        navigationAction.params = { drawer: CONTACT_MENU_DRAWER, isCurrentUser: true };
        mockFnWithParams(analytics, 'trackState', trackStateResult, 'people : self : menu : menu');

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

