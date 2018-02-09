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
let navigationAction;

const back = { type: 'Navigation/BACK' };

const trackStateResult = { type: 'tracked state' };

const test = (expectedScreenname) => {
  mockFnWithParams(analytics, 'trackState', trackStateResult, expectedScreenname);

  store.dispatch(navigationAction);

  expect(store.getActions()).toEqual([ navigationAction, trackStateResult ]);
};

describe('navigate forward', () => {
  beforeEach(() => {
    store = mockStore();
  });

  it('tracks screenname when navigating', () => {
    const screenName = 'test : forward';
    navigationAction = { type: NAVIGATE_FORWARD, routeName: routeName };
    trackableScreens[routeName] = { name: screenName };

    test(screenName);
  });

  describe('to contact screen', () => {
    it('tracks person steps', () => {
      store = mockStore({ auth: { personId: 2 } });
      navigationAction = { type: NAVIGATE_FORWARD, routeName: CONTACT_SCREEN, params: { person: { id: 1 } } };

      test(PERSON_STEPS);
    });


    it('tracks self steps', () => {
      const id = 3;
      store = mockStore({ auth: { personId: id } });
      navigationAction = { type: NAVIGATE_FORWARD, routeName: CONTACT_SCREEN, params: { person: { id: id } } };

      test(SELF_STEPS);
    });
  });

  describe('to drawer', () => {
    beforeEach(() => {
      navigationAction = { type: NAVIGATE_FORWARD, routeName: DRAWER_OPEN, params: { drawer: MAIN_MENU_DRAWER } };
    });

    it('tracks main menu drawer', () => {
      navigationAction.params = { drawer: MAIN_MENU_DRAWER };

      test('menu : menu');
    });

    describe('contact drawer', () => {
      it('tracks self menu', () => {
        navigationAction.params = { drawer: CONTACT_MENU_DRAWER, isCurrentUser: false };

        test('people : person : menu : menu');
      });

      it('tracks person menu', () => {
        navigationAction.params = { drawer: CONTACT_MENU_DRAWER, isCurrentUser: true };

        test('people : self : menu : menu');
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

