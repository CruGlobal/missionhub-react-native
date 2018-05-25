import { DrawerActions } from 'react-navigation';
import configureStore from 'redux-mock-store';

import {
  CONTACT_MENU_DRAWER,
  CONTACT_TAB_CHANGED,
  IMPACT_TAB,
  MAIN_MENU_DRAWER,
  MAIN_TAB_CHANGED,
  NAVIGATE_BACK,
  NAVIGATE_FORWARD,
  NAVIGATE_RESET,
  PEOPLE_TAB,
  STEPS_TAB,
} from '../../src/constants';
import tracking from '../../src/middleware/tracking';
import { stepsTab, trackableScreens } from '../../src/AppRoutes';
import { CONTACT_SCREEN } from '../../src/containers/ContactScreen';
import { PERSON_STEPS, SELF_STEPS } from '../../src/components/ContactHeader';
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

  describe('to contact screen', () => {
    it('tracks person steps', () => {
      store = mockStore({
        auth: {
          person: {
            id: 2,
          },
        },
      });
      navigationAction = {
        type: NAVIGATE_FORWARD,
        routeName: CONTACT_SCREEN,
        params: { person: { id: 1 } },
      };

      store.dispatch(navigationAction);

      expect(trackState).toHaveBeenCalledWith(PERSON_STEPS);
      expect(store.getActions()).toEqual([
        navigationAction,
        { type: CONTACT_TAB_CHANGED, newActiveTab: PERSON_STEPS },
        trackStateResult,
      ]);
    });

    it('tracks self steps', () => {
      const id = 3;
      store = mockStore({
        auth: {
          person: {
            id: id,
          },
        },
      });
      navigationAction = {
        type: NAVIGATE_FORWARD,
        routeName: CONTACT_SCREEN,
        params: { person: { id: id } },
      };

      store.dispatch(navigationAction);

      expect(trackState).toHaveBeenCalledWith(SELF_STEPS);
      expect(store.getActions()).toEqual([
        navigationAction,
        { type: CONTACT_TAB_CHANGED, newActiveTab: SELF_STEPS },
        trackStateResult,
      ]);
    });

    it('updates active main tab for steps tab', () => {
      navigationAction = { type: NAVIGATE_FORWARD, routeName: STEPS_TAB };

      store.dispatch(navigationAction);

      expect(store.getActions()).toEqual([
        navigationAction,
        { type: MAIN_TAB_CHANGED, newActiveTab: stepsTab },
        trackStateResult,
      ]);
    });

    it('updates active main tab for people tab', () => {
      navigationAction = { type: NAVIGATE_FORWARD, routeName: PEOPLE_TAB };

      store.dispatch(navigationAction);

      expect(store.getActions()).toEqual([
        navigationAction,
        {
          type: MAIN_TAB_CHANGED,
          newActiveTab: buildTrackingObj('people', 'people'),
        },
        trackStateResult,
      ]);
    });

    it('updates active main tab for impact tab', () => {
      navigationAction = { type: NAVIGATE_FORWARD, routeName: IMPACT_TAB };

      store.dispatch(navigationAction);

      expect(store.getActions()).toEqual([
        navigationAction,
        {
          type: MAIN_TAB_CHANGED,
          newActiveTab: buildTrackingObj('impact', 'impact'),
        },
        trackStateResult,
      ]);
    });
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
