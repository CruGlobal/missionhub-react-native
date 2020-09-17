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
import { RootState } from '../reducers';

import { loadHome } from './auth/userData';

export function navigatePush(screen: string, props = {}) {
  return (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    dispatch(
      StackActions.push({
        routeName: screen,
        params: props,
      }),
    );
  };
}

export function navigateBack(times?: number) {
  return (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
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
    params?: Record<string, unknown>;
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
                ...(params ? { params } : {}),
              }),
            }
          : {}),
      }),
    ),
    screens.length - 1,
  );

const resetStack = (actions: NavigationNavigateAction[], index = 0) => (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
) =>
  dispatch(
    StackActions.reset({
      index,
      key: null, // Reset root stack navigator
      actions,
    }),
  );

// The reset home and reset login are handled by the login/logout auth actions

export const navigateToMainTabs = (tabName = PEOPLE_TAB) => (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
) => {
  dispatch(loadHome());
  dispatch(navigateNestedReset([{ routeName: MAIN_TABS, tabName }]));
};

export const navigateToFeedItemComments = (
  feedItemId: string,
  communityId: string,
) => (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
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
        params: { feedItemId, fromNotificationCenterItem: true },
      },
    ]),
  );
};

export const navigateToCommunityFeed = (communityId: string) => (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
) => {
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
    ]),
  );
};
