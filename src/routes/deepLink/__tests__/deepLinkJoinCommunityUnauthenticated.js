import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { DeepLinkJoinCommunityUnauthenticatedScreens } from '../deepLinkJoinCommunityUnauthenticated';
import { renderShallow } from '../../../../testUtils';
import callApi, { REQUESTS } from '../../../actions/api';
import * as navigationActions from '../../../actions/navigation';
import * as common from '../../../utils/common';
import {
  STASH_COMMUNITY_TO_JOIN,
  FIRST_TIME,
  COMPLETE_ONBOARDING,
} from '../../../constants';
import { WELCOME_SCREEN } from '../../../containers/WelcomeScreen';
import { KEY_LOGIN_SCREEN } from '../../../containers/KeyLoginScreen';
import { SETUP_SCREEN } from '../../../containers/SetupScreen';
import { GROUP_SCREEN } from '../../../containers/Groups/GroupScreen';
import { DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN } from '../../../containers/Groups/DeepLinkConfirmJoinGroupScreen';

jest.mock('../../../actions/api');
common.isAndroid = false;

const community = { id: '1', community_url: '1234567890123456' };

const store = configureStore([thunk])({
  auth: { person: { id: '1' } },
  profile: {
    firstName: 'Test',
    community,
  },
});

beforeEach(() => {
  store.clearActions();
  jest.clearAllMocks();
  callApi.mockReturnValue(() => Promise.resolve());
});

describe('JoinGroupScreen next', () => {
  it('should fire required next actions', async () => {
    const Component =
      DeepLinkJoinCommunityUnauthenticatedScreens[
        DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN
      ].screen;

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: { params: { communityUrlCode: '1234567890123456' } },
          }}
        />,
        store,
      )
        .instance()
        .props.next({
          community,
        }),
    );

    expect(store.getActions()).toEqual([
      {
        type: STASH_COMMUNITY_TO_JOIN,
        community,
      },
      {
        params: {
          allowSignIn: true,
        },
        routeName: WELCOME_SCREEN,
        type: 'Navigation/NAVIGATE',
      },
    ]);
  });
});

describe('WelcomeScreen next', () => {
  it('should fire required next actions for signin', async () => {
    const Component =
      DeepLinkJoinCommunityUnauthenticatedScreens[WELCOME_SCREEN].screen;

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: { params: { allowSignIn: true } },
          }}
        />,
        store,
      )
        .instance()
        .props.next({
          signin: true,
        }),
    );

    expect(store.getActions()).toEqual([
      {
        params: {},
        routeName: KEY_LOGIN_SCREEN,
        type: 'Navigation/NAVIGATE',
      },
    ]);
  });

  it('should fire required next actions for signup', async () => {
    const Component =
      DeepLinkJoinCommunityUnauthenticatedScreens[WELCOME_SCREEN].screen;

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: { params: { allowSignIn: true } },
          }}
        />,
        store,
      )
        .instance()
        .props.next({
          signin: false,
        }),
    );

    expect(store.getActions()).toEqual([
      {
        params: {},
        routeName: SETUP_SCREEN,
        type: 'Navigation/NAVIGATE',
      },
    ]);
  });
});

describe('SetupScreen next', () => {
  it('should fire required next actions', async () => {
    navigationActions.navigatePush = jest.fn((_, { onComplete }) =>
      onComplete(),
    );

    const Component =
      DeepLinkJoinCommunityUnauthenticatedScreens[SETUP_SCREEN].screen;

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: { params: {} },
          }}
        />,
        store,
      )
        .instance()
        .props.next(),
    );

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.JOIN_COMMUNITY,
      {},
      {
        data: {
          attributes: {
            community_url: community.community_url,
            organization_id: community.id,
            permission_id: 4,
            person_id: '1',
          },
          type: 'organizational_permission',
        },
      },
    );

    expect(navigationActions.navigatePush).toHaveBeenCalled();

    expect(store.getActions()).toEqual([
      { type: FIRST_TIME },
      { type: COMPLETE_ONBOARDING },
      {
        actions: [
          {
            params: { organization: community },
            routeName: GROUP_SCREEN,
            type: 'Navigation/NAVIGATE',
          },
        ],
        index: 0,
        key: null,
        type: 'Navigation/RESET',
      },
    ]);
  });
});

describe('KeyLoginScreen next', () => {
  it('should fire required next actions', async () => {
    navigationActions.navigatePush = jest.fn((_, { onComplete }) =>
      onComplete(),
    );

    const Component =
      DeepLinkJoinCommunityUnauthenticatedScreens[KEY_LOGIN_SCREEN].screen;

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: { params: {} },
          }}
        />,
        store,
      )
        .instance()
        .props.next(),
    );

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.JOIN_COMMUNITY,
      {},
      {
        data: {
          attributes: {
            community_url: community.community_url,
            organization_id: community.id,
            permission_id: 4,
            person_id: '1',
          },
          type: 'organizational_permission',
        },
      },
    );

    expect(navigationActions.navigatePush).not.toHaveBeenCalled();

    expect(store.getActions()).toEqual([
      {
        actions: [
          {
            params: {
              organization: community,
            },
            routeName: GROUP_SCREEN,
            type: 'Navigation/NAVIGATE',
          },
        ],
        index: 0,
        key: null,
        type: 'Navigation/RESET',
      },
    ]);
  });
});
