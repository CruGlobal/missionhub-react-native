import { NavigationActions } from 'react-navigation';

import {
  navigatePush,
  navigateBack,
  navigateReset,
  navigateReplace,
  navigateNestedReset,
  navigateResetTab,
  navigateToMainTabs,
} from '../navigation';
import { MAIN_TABS, GROUPS_TAB } from '../../constants';
import { loadHome } from '../auth/userData';
import { createThunkStore } from '../../../testUtils';

jest.mock('../auth/userData', () => ({
  loadHome: jest.fn(() => ({ type: 'loadHome' })),
}));

const routeName = 'screenName';
const params = { prop1: 'value1' };

describe('navigatePush', () => {
  it('should push new screen onto the stack', () => {
    const { dispatch, getActions } = createThunkStore();

    dispatch(navigatePush(routeName, params));

    expect(getActions()).toEqual([
      {
        type: 'Navigation/PUSH',
        routeName,
        params,
      },
    ]);
  });
  it('should push new screen onto the stack with no props', () => {
    const { dispatch, getActions } = createThunkStore();

    dispatch(navigatePush(routeName));

    expect(getActions()).toEqual([
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
    const { dispatch, getActions } = createThunkStore();

    dispatch(navigateBack());

    expect(getActions()).toEqual([
      { type: 'Navigation/BACK', immediate: undefined, key: undefined },
    ]);
  });
  it('should navigate back multiple times', () => {
    const { dispatch, getActions } = createThunkStore();

    dispatch(navigateBack(5));

    expect(getActions()).toEqual([
      { type: 'Navigation/POP', n: 5, immediate: true },
    ]);
  });
});

describe('navigateReset', () => {
  it('should reset navigation stack', () => {
    const { dispatch, getActions } = createThunkStore();

    dispatch(navigateReset(routeName, params));

    expect(getActions()).toEqual([
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
    const { dispatch, getActions } = createThunkStore();

    dispatch(navigateReset(routeName));

    expect(getActions()).toEqual([
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
  const screen1 = 'roger';
  const params1 = { id: '1' };
  const screen2 = 'the dummy';
  const params2 = { id: '2' };

  it('should reset to a nested navigate stack', () => {
    const { dispatch, getActions } = createThunkStore();

    dispatch(
      navigateNestedReset([
        { routeName: screen1, params: params1 },
        { routeName: screen2, params: params2 },
      ]),
    );

    expect(getActions()).toEqual([
      {
        type: 'Navigation/RESET',
        index: 1,
        key: null,
        actions: [
          { type: 'Navigation/NAVIGATE', routeName: screen1, params: params1 },
          { type: 'Navigation/NAVIGATE', routeName: screen2, params: params2 },
        ],
      },
    ]);
  });
});

describe('navigateResetTab', () => {
  const screen1 = 'Tabs Screen';
  const screen2 = 'Specific Tab';

  it('should reset to a specific tab', () => {
    const { dispatch, getActions } = createThunkStore();

    dispatch(navigateResetTab(screen1, screen2));

    expect(getActions()).toEqual([
      {
        type: 'Navigation/RESET',
        index: 0,
        key: null,
        actions: [
          {
            type: 'Navigation/NAVIGATE',
            routeName: screen1,
            action: NavigationActions.navigate({ routeName: screen2 }),
          },
        ],
      },
    ]);
  });
});

describe('navigateReplace', () => {
  it('should replace last route in navigation stack', () => {
    const { dispatch, getActions } = createThunkStore();

    dispatch(navigateReplace(routeName, params));

    expect(getActions()).toEqual([
      {
        type: 'Navigation/REPLACE',
        routeName,
        params,
        immediate: true,
      },
    ]);
  });
});

describe('navigateToMainTabs', () => {
  it('should dispatch loadHome and then navigate to main tabs', () => {
    const { dispatch, getActions } = createThunkStore();

    dispatch(navigateToMainTabs(GROUPS_TAB));

    expect(loadHome).toHaveBeenCalled();
    expect(getActions()).toEqual([
      { type: 'loadHome' },
      {
        type: 'Navigation/RESET',
        index: 0,
        key: null,
        actions: [
          {
            type: 'Navigation/NAVIGATE',
            routeName: MAIN_TABS,
            action: NavigationActions.navigate({ routeName: GROUPS_TAB }),
          },
        ],
      },
    ]);
  });
});
