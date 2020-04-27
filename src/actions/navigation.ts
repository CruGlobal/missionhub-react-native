/* eslint-disable @typescript-eslint/no-explicit-any, import/named */

import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  NavigationActions,
  StackActions,
  NavigationNavigateAction,
} from 'react-navigation';

import { GROUP_UNREAD_FEED_SCREEN } from '../containers/Groups/GroupUnreadFeed';
import { CELEBRATE_DETAIL_SCREEN } from '../containers/CelebrateDetailScreen';
import { MAIN_TABS, STEPS_TAB } from '../constants';
import { Organization } from '../reducers/organizations';
import { COMMUNITY_TABS } from '../containers/Communities/Community/constants';

import { loadHome } from './auth/userData';

export function navigatePush(screen: string, props = {}) {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(
      StackActions.push({
        routeName: screen,
        params: props,
      }),
    );
  };
}

export function navigateBack(times?: number) {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    if (times && times > 1) {
      dispatch(StackActions.pop({ n: times, immediate: true }));
    } else {
      dispatch(NavigationActions.back());
    }
  };
}

export const navigateReset = (screen: string, props = {}) =>
  resetStack([
    NavigationActions.navigate({ routeName: screen, params: props }),
  ]);

export const navigateNestedReset = (
  screens: {
    routeName: string;
    params: { [key: string]: any };
  }[],
) =>
  resetStack(
    screens.map(({ routeName, params = {} }) =>
      NavigationActions.navigate({ routeName, params }),
    ),
    screens.length - 1,
  );

export const navigateResetTab = (routeName: string, tabName: string) =>
  resetStack([
    NavigationActions.navigate({
      routeName,
      action: NavigationActions.navigate({ routeName: tabName }),
    }),
  ]);

const resetStack = (actions: NavigationNavigateAction[], index = 0) => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) =>
  dispatch(
    StackActions.reset({
      index,
      key: null, // Reset root stack navigator
      actions,
    }),
  );

// The reset home and reset login are handled by the login/logout auth actions

export function navigateReplace(screen: string, props = {}) {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(
      StackActions.replace({
        routeName: screen,
        params: props,
      }),
    );
  };
}

export const navigateToMainTabs = (tab = STEPS_TAB) => (
  dispatch: ThunkDispatch<never, {}, AnyAction>,
) => {
  dispatch(loadHome());
  dispatch(navigateResetTab(MAIN_TABS, tab));
};

export const navigateToCelebrateComments = (
  community: Organization,
  celebrationItemId?: string | null,
) => (dispatch: ThunkDispatch<{}, null, AnyAction>) => {
  const orgId = community.id;

  const event = { id: celebrationItemId };

  if (celebrationItemId) {
    dispatch(
      navigateNestedReset([
        {
          routeName: COMMUNITY_TABS,
          params: { communityId: orgId },
        },
        {
          routeName: GROUP_UNREAD_FEED_SCREEN,
          params: { organization: community },
        },
        { routeName: CELEBRATE_DETAIL_SCREEN, params: { event, orgId } },
      ]),
    );
  } else {
    dispatch(
      navigatePush(COMMUNITY_TABS, {
        communityId: community.id,
      }),
    );
  }
};
