import { NavigationActions, StackActions } from 'react-navigation';

import { MAIN_TABS, STEPS_TAB } from '../constants';

import { loadHome } from './auth/userData';

export function navigatePush(screen, props = {}) {
  return dispatch => {
    dispatch(
      StackActions.push({
        routeName: screen,
        params: props,
      }),
    );
  };
}

export function navigateBack(times) {
  return dispatch => {
    if (times && times > 1) {
      dispatch(StackActions.pop({ n: times, immediate: true }));
    } else {
      dispatch(NavigationActions.back());
    }
  };
}

export const navigateReset = (screen, props = {}) =>
  resetStack(NavigationActions.navigate({ routeName: screen, params: props }));

export const navigateNestedReset = (...screens) =>
  resetStack(
    screens.map(routeName => NavigationActions.navigate({ routeName })),
    screens.length - 1,
  );

export const navigateResetTab = (routeName, tabName) =>
  resetStack(
    NavigationActions.navigate({
      routeName,
      action: NavigationActions.navigate({ routeName: tabName }),
    }),
  );

const resetStack = (actions, index = 0) => dispatch =>
  dispatch(
    StackActions.reset({
      index,
      key: null, // Reset root stack navigator
      actions: Array.isArray(actions) ? actions : [actions],
    }),
  );

// The reset home and reset login are handled by the login/logout auth actions

export function navigateReplace(screen, props = {}) {
  return dispatch => {
    dispatch(
      StackActions.replace({
        routeName: screen,
        params: props,
        immediate: true,
      }),
    );
  };
}

export const navigateToMainTabs = (tab = STEPS_TAB) => dispatch => {
  dispatch(loadHome());
  dispatch(navigateResetTab(MAIN_TABS, tab));
};
