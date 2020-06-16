/* eslint max-lines: 0 */
/* eslint-disable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line import/named
import { NavigationActions } from 'react-navigation';
import { MockStore } from 'redux-mock-store';

import {
  navigatePush,
  navigateBack,
  navigateReset,
  navigateReplace,
  navigateNestedReset,
  navigateToMainTabs,
  navigateToCelebrateComments,
} from '../navigation';
import { MAIN_TABS, COMMUNITIES_TAB } from '../../constants';
import { loadHome } from '../auth/userData';
import { createThunkStore } from '../../../testUtils';
import { GROUP_UNREAD_FEED_SCREEN } from '../../containers/Groups/GroupUnreadFeed';
import { FEED_ITEM_DETAIL_SCREEN } from '../../containers/Communities/Community/CommunityFeedTab/FeedItemDetailScreen/FeedItemDetailScreen';
import { COMMUNITY_TABS } from '../../containers/Communities/Community/constants';

jest.mock('../auth/userData');

let store: MockStore;

const routeName = 'screenName';
const params = { prop1: 'value1' };

const loadHomeResponse = { type: 'loadHome' };

beforeEach(() => {
  store = createThunkStore();
  (loadHome as any).mockReturnValue(loadHomeResponse);
});

describe('navigatePush', () => {
  it('should push new screen onto the stack', () => {
    store.dispatch<any>(navigatePush(routeName, params));

    expect(store.getActions()).toEqual([
      {
        type: 'Navigation/PUSH',
        routeName,
        params,
      },
    ]);
  });

  it('should push new screen onto the stack with no props', () => {
    store.dispatch<any>(navigatePush(routeName));

    expect(store.getActions()).toEqual([
      {
        type: 'Navigation/PUSH',
        routeName,
        params: {},
      },
    ]);
  });
});

describe('navigateBack', () => {
  it('should navigate back once', () => {
    store.dispatch<any>(navigateBack());

    expect(store.getActions()).toEqual([
      { type: 'Navigation/BACK', immediate: undefined, key: undefined },
    ]);
  });
  it('should navigate back multiple times', () => {
    store.dispatch<any>(navigateBack(5));

    expect(store.getActions()).toEqual([
      { type: 'Navigation/POP', n: 5, immediate: true },
    ]);
  });
});

describe('navigateReset', () => {
  it('should reset navigation stack', () => {
    store.dispatch<any>(navigateReset(routeName, params));

    expect(store.getActions()).toEqual([
      {
        type: 'Navigation/RESET',
        index: 0,
        key: null,
        actions: [
          {
            type: 'Navigation/NAVIGATE',
            routeName,
            params,
          },
        ],
      },
    ]);
  });
  it('should reset navigation stack with no props', () => {
    store.dispatch<any>(navigateReset(routeName));

    expect(store.getActions()).toEqual([
      {
        type: 'Navigation/RESET',
        index: 0,
        key: null,
        actions: [
          {
            type: 'Navigation/NAVIGATE',
            routeName,
            params: {},
          },
        ],
      },
    ]);
  });
});

describe('navigateNestedReset', () => {
  const tabsScreen = 'tabsScreen';
  const tab1 = 'tab1';
  const screen1 = 'roger';
  const params1 = { id: '1' };
  const screen2 = 'the dummy';
  const params2 = { id: '2' };

  it('should reset to a nested navigate stack', () => {
    store.dispatch<any>(
      navigateNestedReset([
        { routeName: tabsScreen, tabName: tab1, params: params1 },
        { routeName: screen1 },
        { routeName: screen2, params: params2 },
      ]),
    );

    expect(store.getActions()).toEqual([
      {
        type: 'Navigation/RESET',
        index: 2,
        key: null,
        actions: [
          {
            type: 'Navigation/NAVIGATE',
            routeName: tabsScreen,
            params: params1,
            action: NavigationActions.navigate({ routeName: tab1 }),
          },
          { type: 'Navigation/NAVIGATE', routeName: screen1 },
          { type: 'Navigation/NAVIGATE', routeName: screen2, params: params2 },
        ],
      },
    ]);
  });
});

describe('navigateReplace', () => {
  it('should replace last route in navigation stack', () => {
    store.dispatch<any>(navigateReplace(routeName, params));

    expect(store.getActions()).toEqual([
      {
        type: 'Navigation/REPLACE',
        routeName,
        params,
      },
    ]);
  });
});

describe('navigateToMainTabs', () => {
  it('should dispatch loadHome and then navigate to main tabs', () => {
    store.dispatch<any>(navigateToMainTabs(COMMUNITIES_TAB));

    expect(loadHome).toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      { type: 'loadHome' },
      {
        type: 'Navigation/RESET',
        index: 0,
        key: null,
        actions: [
          {
            type: 'Navigation/NAVIGATE',
            routeName: MAIN_TABS,
            action: NavigationActions.navigate({ routeName: COMMUNITIES_TAB }),
          },
        ],
      },
    ]);
  });
});

describe('navigateToCelebrateComments', () => {
  const communityId = '123456';
  const feedItemId = '111';

  it('navigates to FEED_ITEM_DETAIL_SCREEN', () => {
    store.dispatch<any>(navigateToCelebrateComments(feedItemId, communityId));

    expect(store.getActions()).toEqual([
      {
        type: 'Navigation/RESET',
        index: 3,
        key: null,
        actions: [
          {
            type: 'Navigation/NAVIGATE',
            routeName: MAIN_TABS,
            action: {
              type: 'Navigation/NAVIGATE',
              routeName: COMMUNITIES_TAB,
            },
          },
          {
            type: 'Navigation/NAVIGATE',
            routeName: COMMUNITY_TABS,
            params: { communityId },
          },
          {
            type: 'Navigation/NAVIGATE',
            routeName: GROUP_UNREAD_FEED_SCREEN,
            params: { communityId },
          },
          {
            type: 'Navigation/NAVIGATE',
            routeName: FEED_ITEM_DETAIL_SCREEN,
            params: {
              feedItemId,
              communityId,
            },
          },
        ],
      },
    ]);
  });
});
