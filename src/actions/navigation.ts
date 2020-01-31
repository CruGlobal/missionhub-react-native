/* eslint-disable @typescript-eslint/no-explicit-any, import/named */

import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  NavigationActions,
  StackActions,
  NavigationNavigateAction,
} from 'react-navigation';

import { orgIsUserCreated } from '../utils/common';
import { getScreenForOrg } from '../containers/Groups/GroupScreen';
import { GROUP_UNREAD_FEED_SCREEN } from '../containers/Groups/GroupUnreadFeed';
import { CELEBRATE_DETAIL_SCREEN } from '../containers/CelebrateDetailScreen';
import { MAIN_TABS, STEPS_TAB, GLOBAL_COMMUNITY_ID } from '../constants';
import { Organization } from '../reducers/organizations';

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
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  dispatch(loadHome());
  dispatch(navigateResetTab(MAIN_TABS, tab));
};

export function navigateToCommunity(
  community: Organization = { id: GLOBAL_COMMUNITY_ID },
  initialTab?: string,
) {
  return (dispatch: ThunkDispatch<{}, null, AnyAction>) => {
    const orgId = community.id;
    const userCreated = orgIsUserCreated(community);

    return dispatch(
      navigatePush(getScreenForOrg(orgId, userCreated), {
        orgId,
        initialTab,
      }),
    );
  };
}

export function navigateToCelebrateComments(
  community: Organization,
  celebrationItemId: string,
) {
  return async (dispatch: ThunkDispatch<{}, null, AnyAction>) => {
    const orgId = community.id;
    const userCreated = orgIsUserCreated(community);

    const event = { id: celebrationItemId, organization: community };

    await dispatch(
      navigateNestedReset([
        {
          routeName: getScreenForOrg(orgId, userCreated),
          params: { orgId },
        },
        {
          routeName: GROUP_UNREAD_FEED_SCREEN,
          params: { organization: community },
        },
        { routeName: CELEBRATE_DETAIL_SCREEN, params: { event } },
      ]),
    );
  };
}
