import { DrawerActions } from 'react-navigation';
import configureStore from 'redux-mock-store';

import {
  MAIN_MENU_DRAWER,
  NAVIGATE_BACK,
  NAVIGATE_FORWARD,
  NAVIGATE_RESET,
  GROUP_TAB_CHANGED,
} from '../../constants';
import tracking from '../tracking';
import { trackableScreens } from '../../AppRoutes';
import { buildTrackingObj } from '../../utils/common';
import { SEARCH_SCREEN } from '../../containers/SearchPeopleScreen';
import { trackState } from '../../actions/analytics';
import {
  GROUP_CHALLENGES,
  USER_CREATED_GROUP_SCREEN,
} from '../../containers/Groups/GroupScreen';

jest.mock('../../actions/analytics');
jest.mock('../../utils/hooks/useLogoutOnBack', () => ({
  useLogoutOnBack: jest.fn(),
}));

const mockStore = configureStore([tracking]);
let store;

const routeName = 'test route';
let navigationAction;

const back = { type: NAVIGATE_BACK };

const trackStateResult = { type: 'tracked state' };

beforeEach(() => {
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

  it('tracks group tab', () => {
    const tracking = { name: 'test : forward' };
    navigationAction = { type: NAVIGATE_FORWARD, routeName: GROUP_CHALLENGES };
    trackableScreens[GROUP_CHALLENGES] = { tracking: tracking };

    store.dispatch(navigationAction);

    expect(trackState).toHaveBeenCalledWith(tracking);
    expect(store.getActions()).toEqual([
      navigationAction,
      { type: GROUP_TAB_CHANGED, newActiveTab: tracking },
      trackStateResult,
    ]);
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

describe('navigate back', () => {
  it('tracks screen', () => {
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

  it('tracks tab', () => {
    const activeGroupTab = { name: 'some tab' };
    store = mockStore({
      nav: {
        routes: [{ routeName: USER_CREATED_GROUP_SCREEN }],
      },
      tabs: {
        activeGroupTab,
      },
    });

    store.dispatch(back);

    expect(trackState).toHaveBeenCalledWith(activeGroupTab);
    expect(store.getActions()).toEqual([back, trackStateResult]);
  });
});
