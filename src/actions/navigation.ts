/* eslint-disable @typescript-eslint/no-explicit-any, import/named */

import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  NavigationActions,
  StackActions,
  NavigationNavigateAction,
} from 'react-navigation';

import { FEED_ITEM_DETAIL_SCREEN } from '../containers/Communities/Community/CommunityFeedTab/FeedItemDetailScreen/FeedItemDetailScreen';
import { MAIN_TABS, PEOPLE_TAB, COMMUNITIES_TAB } from '../constants';
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
    tabName?: string;
    params?: { [key: string]: any };
  }[],
) =>
  resetStack(
    screens.map(({ routeName, params, tabName }) =>
      NavigationActions.navigate({
        routeName,
        ...(params ? { params } : {}),
        ...(tabName
          ? {
              action: NavigationActions.navigate({
                routeName: tabName,
              }),
            }
          : {}),
      }),
    ),
    screens.length - 1,
  );

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

export const navigateToMainTabs = (tabName = PEOPLE_TAB) => (
  dispatch: ThunkDispatch<never, {}, AnyAction>,
) => {
  dispatch(loadHome());
  dispatch(navigateNestedReset([{ routeName: MAIN_TABS, tabName }]));
};

export const navigateToFeedItemComments = (
  feedItemId: string,
  communityId: string,
) => (dispatch: ThunkDispatch<{}, null, AnyAction>) => {
  dispatch(
    navigateNestedReset([
      {
        routeName: MAIN_TABS,
        tabName: COMMUNITIES_TAB,
      },
      {
        routeName: COMMUNITY_TABS,
        params: { communityId },
      },
      {
        routeName: FEED_ITEM_DETAIL_SCREEN,
        params: { feedItemId },
      },
    ]),
  );
};
