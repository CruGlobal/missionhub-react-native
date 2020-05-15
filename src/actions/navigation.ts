/* eslint-disable @typescript-eslint/no-explicit-any, import/named */

import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  NavigationActions,
  StackActions,
  NavigationNavigateAction,
} from 'react-navigation';

import { GROUP_UNREAD_FEED_SCREEN } from '../containers/Groups/GroupUnreadFeed';
import { CELEBRATE_DETAIL_SCREEN } from '../containers/Communities/Community/CommunityFeed/FeedItemDetailScreen/FeedItemDetailScreen';
import { MAIN_TABS, PEOPLE_TAB, COMMUNITIES_TAB } from '../constants';
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
          routeName: MAIN_TABS,
          tabName: COMMUNITIES_TAB,
        },
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
