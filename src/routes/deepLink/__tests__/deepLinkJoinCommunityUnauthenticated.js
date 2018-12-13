import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { DeepLinkJoinCommunityUnauthenticatedScreens } from '../deepLinkJoinCommunityUnauthenticated';
import { renderShallow } from '../../../../testUtils';
import callApi, { REQUESTS } from '../../../actions/api';
import * as navigationActions from '../../../actions/navigation';
import * as common from '../../../utils/common';
import { joinCommunity } from '../../../actions/organizations';
import { firstTime, loadHome } from '../../../actions/auth';
import {
  completeOnboarding,
  stashCommunityToJoin,
  joinStashedCommunuity,
  showNotificationPrompt,
  landOnStashedCommunityScreen,
} from '../../../actions/onboardingProfile';
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
jest.mock('../../../actions/auth');
jest.mock('../../../actions/onboardingProfile');
jest.mock('../../../actions/navigation');
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
  navigationActions.navigatePush.mockReturnValue(() => Promise.resolve());
});

describe('JoinGroupScreen next', () => {
  it('should fire required next actions', async () => {
    stashCommunityToJoin.mockReturnValue(() => Promise.resolve());

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

    expect(stashCommunityToJoin).toHaveBeenCalledWith({ community });
    expect(navigationActions.navigatePush).toHaveBeenCalledWith(
      WELCOME_SCREEN,
      {
        allowSignIn: true,
      },
    );
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

    expect(navigationActions.navigatePush).toHaveBeenCalledWith(
      KEY_LOGIN_SCREEN,
    );
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

    expect(navigationActions.navigatePush).toHaveBeenCalledWith(SETUP_SCREEN);
  });
});

describe('SetupScreen next', () => {
  it('should fire required next actions', async () => {
    firstTime.mockReturnValue(() => Promise.resolve());
    completeOnboarding.mockReturnValue(() => Promise.resolve());
    joinStashedCommunuity.mockReturnValue(() => Promise.resolve());
    showNotificationPrompt.mockReturnValue(() => Promise.resolve());
    loadHome.mockReturnValue(() => Promise.resolve());
    landOnStashedCommunityScreen.mockReturnValue(() => Promise.resolve());

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

    expect(firstTime).toHaveBeenCalled();
    expect(completeOnboarding).toHaveBeenCalled();
    expect(joinStashedCommunuity).toHaveBeenCalled();
    expect(showNotificationPrompt).toHaveBeenCalled();
    expect(loadHome).toHaveBeenCalled();
    expect(landOnStashedCommunityScreen).toHaveBeenCalled();
  });
});

describe('KeyLoginScreen next', () => {
  it('should fire required next actions', async () => {
    joinStashedCommunuity.mockReturnValue(() => Promise.resolve());
    loadHome.mockReturnValue(() => Promise.resolve());
    landOnStashedCommunityScreen.mockReturnValue(() => Promise.resolve());

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

    expect(joinStashedCommunuity).toHaveBeenCalled();
    expect(loadHome).toHaveBeenCalled();
    expect(landOnStashedCommunityScreen).toHaveBeenCalled();
  });
});
