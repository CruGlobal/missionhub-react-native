import { DrawerActions } from 'react-navigation';
import configureStore from 'redux-mock-store';

import {
  CONTACT_MENU_DRAWER,
  MAIN_MENU_DRAWER,
  NAVIGATE_BACK,
  NAVIGATE_FORWARD,
  NAVIGATE_RESET,
} from '../../src/constants';
import tracking from '../../src/middleware/tracking';
import { trackableScreens } from '../../src/AppRoutes';
import { buildTrackingObj } from '../../src/utils/common';
import { SEARCH_SCREEN } from '../../src/containers/SearchPeopleScreen';
import { trackState } from '../../src/actions/analytics';

jest.mock('../../src/actions/analytics');

const mockStore = configureStore([tracking]);
let store;

const routeName = 'test route';
let navigationAction;

const back = { type: NAVIGATE_BACK };

const trackStateResult = { type: 'tracked state' };

beforeEach(() => {
  trackState.mockReset();
  trackState.mockReturnValue(trackStateResult);
});

describe('navigate forward', () => {
  beforeEach(() => (store = mockStore()));

  it('tracks screenname when navigating', () => {
    const tracking = { name: 'test : forward' };
    navigationAction = { type: NAVIGATE_FORWARD, routeName: routeName };
    trackableScreens[routeName] = { tracking: tracking };

    store.dispatch(navigationAction);

    expect(trackState).toHaveBeenCalledWith(tracking);
    expect(store.getActions()).toEqual([navigationAction, trackStateResult]);
  });

  describe('to drawer', () => {
    beforeEach(() => {
      navigationAction = {
        type: DrawerActions.OPEN_DRAWER,
        drawer: MAIN_MENU_DRAWER,
      };
    });

    it('tracks nothing if drawer is not specified', () => {
      navigationAction = {
        ...navigationAction,
        drawer: undefined,
      };

      store.dispatch(navigationAction);

      expect(trackState).not.toHaveBeenCalled();
    });

    it('tracks main menu drawer', () => {
      navigationAction = {
        ...navigationAction,
        drawer: MAIN_MENU_DRAWER,
      };

      store.dispatch(navigationAction);

      expect(trackState).toHaveBeenCalledWith(buildTrackingObj('menu', 'menu'));
      expect(store.getActions()).toEqual([navigationAction, trackStateResult]);
    });

    describe('contact drawer', () => {
      it('tracks self menu', () => {
        navigationAction = {
          ...navigationAction,
          drawer: CONTACT_MENU_DRAWER,
          isCurrentUser: false,
        };

        store.dispatch(navigationAction);

        expect(trackState).toHaveBeenCalledWith(
          buildTrackingObj(
            'people : person : menu',
            'people',
            'person',
            'menu',
          ),
        );
        expect(store.getActions()).toEqual([
          navigationAction,
          trackStateResult,
        ]);
      });

      it('tracks person menu', () => {
        navigationAction = {
          ...navigationAction,
          drawer: CONTACT_MENU_DRAWER,
          isCurrentUser: true,
        };

        store.dispatch(navigationAction);

        expect(trackState).toHaveBeenCalledWith(
          buildTrackingObj('people : self : menu', 'people', 'self', 'menu'),
        );
        expect(store.getActions()).toEqual([
          navigationAction,
          trackStateResult,
        ]);
      });
    });
  });
});

describe('navigate reset', () => {
  it('tracks screen', () => {
    store = mockStore();
    const tracking = { name: 'test : reset' };
    navigationAction = {
      type: NAVIGATE_RESET,
      actions: [{ routeName: routeName }],
    };
    trackableScreens[routeName] = { tracking: tracking };

    store.dispatch(navigationAction);

    expect(trackState).toHaveBeenCalledWith(tracking);
    expect(store.getActions()).toEqual([navigationAction, trackStateResult]);
  });
});

it('tracks screen when navigating back', () => {
  store = mockStore({
    nav: {
      routes: [{ routeName: SEARCH_SCREEN }],
    },
  });

  store.dispatch(back);

  expect(trackState).toHaveBeenCalledWith(
    trackableScreens[SEARCH_SCREEN].tracking,
  );
  expect(store.getActions()).toEqual([back, trackStateResult]);
});
