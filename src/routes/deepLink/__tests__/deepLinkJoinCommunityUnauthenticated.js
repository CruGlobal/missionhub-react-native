import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { DeepLinkJoinCommunityUnauthenticatedScreens } from '../deepLinkJoinCommunityUnauthenticated';
import { renderShallow } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import * as common from '../../../utils/common';
import { firstTime, loadHome } from '../../../actions/auth/userData';
import {
  completeOnboarding,
  stashCommunityToJoin,
  joinStashedCommunity,
  showNotificationPrompt,
  landOnStashedCommunityScreen,
} from '../../../actions/onboardingProfile';
import { WELCOME_SCREEN } from '../../../containers/WelcomeScreen';
import { SIGN_IN_SCREEN } from '../../../containers/Auth/SignInScreen';
import { SETUP_SCREEN } from '../../../containers/SetupScreen';
import { DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN } from '../../../containers/Groups/DeepLinkConfirmJoinGroupScreen';
import { MFA_CODE_SCREEN } from '../../../containers/Auth/MFACodeScreen';

jest.mock('../../../actions/api');
jest.mock('../../../actions/auth/userData');
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
  navigatePush.mockReturnValue(() => Promise.resolve());
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
    expect(navigatePush).toHaveBeenCalledWith(WELCOME_SCREEN, {
      allowSignIn: true,
    });
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

    expect(navigatePush).toHaveBeenCalledWith(SIGN_IN_SCREEN);
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

    expect(navigatePush).toHaveBeenCalledWith(SETUP_SCREEN);
  });
});

describe('SetupScreen next', () => {
  it('should fire required next actions', async () => {
    firstTime.mockReturnValue(() => Promise.resolve());
    completeOnboarding.mockReturnValue(() => Promise.resolve());
    joinStashedCommunity.mockReturnValue(() => Promise.resolve());
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
    expect(joinStashedCommunity).toHaveBeenCalled();
    expect(showNotificationPrompt).toHaveBeenCalled();
    expect(loadHome).toHaveBeenCalled();
    expect(landOnStashedCommunityScreen).toHaveBeenCalled();
  });
});

describe('SignInScreen next', () => {
  it('should finish auth', async () => {
    joinStashedCommunity.mockReturnValue(() => Promise.resolve());
    loadHome.mockReturnValue(() => Promise.resolve());
    landOnStashedCommunityScreen.mockReturnValue(() => Promise.resolve());

    const Component =
      DeepLinkJoinCommunityUnauthenticatedScreens[SIGN_IN_SCREEN].screen;

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

    expect(joinStashedCommunity).toHaveBeenCalled();
    expect(loadHome).toHaveBeenCalled();
    expect(landOnStashedCommunityScreen).toHaveBeenCalled();
  });
  it('should navigate to mfa code screen', async () => {
    const email = 'test@test.com';
    const password = 'test1234';

    joinStashedCommunity.mockReturnValue(() => Promise.resolve());
    loadHome.mockReturnValue(() => Promise.resolve());
    landOnStashedCommunityScreen.mockReturnValue(() => Promise.resolve());

    const Component =
      DeepLinkJoinCommunityUnauthenticatedScreens[SIGN_IN_SCREEN].screen;

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
        .props.next({
          requires2FA: true,
          email,
          password,
        }),
    );

    expect(joinStashedCommunity).not.toHaveBeenCalled();
    expect(loadHome).not.toHaveBeenCalled();
    expect(landOnStashedCommunityScreen).not.toHaveBeenCalled();
    expect(navigatePush).toHaveBeenCalledWith(MFA_CODE_SCREEN, {
      email,
      password,
    });
  });
});
