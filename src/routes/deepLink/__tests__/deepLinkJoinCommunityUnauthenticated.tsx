import React from 'react';

import { DeepLinkJoinCommunityUnauthenticatedScreens } from '../deepLinkJoinCommunityUnauthenticated';
import { renderWithContext } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import * as common from '../../../utils/common';
import { loadHome } from '../../../actions/auth/userData';
import {
  setOnboardingCommunity,
  joinStashedCommunity,
  landOnStashedCommunityScreen,
  setOnboardingPersonId,
} from '../../../actions/onboarding';
import { WELCOME_SCREEN } from '../../../containers/WelcomeScreen';
import { SIGN_IN_SCREEN } from '../../../containers/Auth/SignInScreen';
import { SETUP_SCREEN } from '../../../containers/SetupScreen';
import { DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN } from '../../../containers/Groups/DeepLinkConfirmJoinGroupScreen';
import { MFA_CODE_SCREEN } from '../../../containers/Auth/MFACodeScreen';
import { GET_STARTED_SCREEN } from '../../../containers/GetStartedScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';

jest.mock('../../../actions/api');
jest.mock('../../../actions/auth/userData');
jest.mock('../../../actions/onboarding');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/notifications');
jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../utils/hooks/useLogoutOnBack', () => ({
  useLogoutOnBack: jest.fn(),
}));

((common as unknown) as { isAndroid: boolean }).isAndroid = false;

const community = { id: '1', community_url: '1234567890123456' };

const initialState = {
  auth: { person: { id: '1' } },
  onboarding: {
    community,
  },
};

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue(() => Promise.resolve());
});

describe('JoinGroupScreen next', () => {
  it('should fire required next actions', async () => {
    (setOnboardingCommunity as jest.Mock).mockReturnValue(() =>
      Promise.resolve(),
    );

    const Component =
      DeepLinkJoinCommunityUnauthenticatedScreens[
        DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN
      ].screen;

    const { store, getByType } = renderWithContext(<Component />, {
      initialState,
    });

    const originalComponent = getByType(Component).children[0];

    if (typeof originalComponent === 'string') {
      throw "Can't access component props";
    }

    await store.dispatch(
      originalComponent.props.next({
        community,
      }),
    );

    expect(setOnboardingCommunity).toHaveBeenCalledWith(community);
    expect(navigatePush).toHaveBeenCalledWith(WELCOME_SCREEN, {
      allowSignIn: true,
    });
  });
});

describe('WelcomeScreen next', () => {
  it('should fire required next actions for signin', async () => {
    const Component =
      DeepLinkJoinCommunityUnauthenticatedScreens[WELCOME_SCREEN].screen;

    const { store, getByType } = renderWithContext(<Component />, {
      initialState,
    });

    const originalComponent = getByType(Component).children[0];

    if (typeof originalComponent === 'string') {
      throw "Can't access component props";
    }

    await store.dispatch(
      originalComponent.props.next({
        signin: true,
      }),
    );

    expect(navigatePush).toHaveBeenCalledWith(SIGN_IN_SCREEN, { signin: true });
  });

  it('should fire required next actions for signup', async () => {
    const Component =
      DeepLinkJoinCommunityUnauthenticatedScreens[WELCOME_SCREEN].screen;

    const { store, getByType } = renderWithContext(<Component />, {
      initialState,
    });

    const originalComponent = getByType(Component).children[0];

    if (typeof originalComponent === 'string') {
      throw "Can't access component props";
    }

    await store.dispatch(
      originalComponent.props.next({
        signin: false,
      }),
    );

    expect(navigatePush).toHaveBeenCalledWith(SETUP_SCREEN, { signin: false });
  });
});

describe('SetupScreen next', () => {
  it('should fire required next actions', async () => {
    (joinStashedCommunity as jest.Mock).mockReturnValue(() =>
      Promise.resolve(),
    );

    const Component =
      DeepLinkJoinCommunityUnauthenticatedScreens[SETUP_SCREEN].screen;

    const { store, getByType } = renderWithContext(<Component />, {
      initialState,
    });

    const originalComponent = getByType(Component).children[0];

    if (typeof originalComponent === 'string') {
      throw "Can't access component props";
    }

    await store.dispatch(originalComponent.props.next());

    expect(joinStashedCommunity).toHaveBeenCalled();
    expect(navigatePush).toHaveBeenCalledWith(GET_STARTED_SCREEN, {
      isMe: true,
    });
  });
});

describe('CELEBRATION_SCREEN next', () => {
  it('should fire required next actions', async () => {
    (loadHome as jest.Mock).mockReturnValue(() => Promise.resolve());
    (landOnStashedCommunityScreen as jest.Mock).mockReturnValue(() =>
      Promise.resolve(),
    );
    (setOnboardingPersonId as jest.Mock).mockReturnValue(() =>
      Promise.resolve(),
    );

    const Component =
      DeepLinkJoinCommunityUnauthenticatedScreens[CELEBRATION_SCREEN].screen;

    const { store, getByType } = renderWithContext(<Component />, {
      initialState,
    });

    const originalComponent = getByType(Component).children[0];

    if (typeof originalComponent === 'string') {
      throw "Can't access component props";
    }

    await store.dispatch(originalComponent.props.next());

    expect(loadHome).toHaveBeenCalled();
    expect(landOnStashedCommunityScreen).toHaveBeenCalled();
    expect(setOnboardingPersonId).toHaveBeenCalledWith('');
  });
});

describe('SignInScreen next', () => {
  it('should finish auth', async () => {
    (joinStashedCommunity as jest.Mock).mockReturnValue(() =>
      Promise.resolve(),
    );
    (loadHome as jest.Mock).mockReturnValue(() => Promise.resolve());
    (landOnStashedCommunityScreen as jest.Mock).mockReturnValue(() =>
      Promise.resolve(),
    );
    (setOnboardingPersonId as jest.Mock).mockReturnValue(() =>
      Promise.resolve(),
    );

    const Component =
      DeepLinkJoinCommunityUnauthenticatedScreens[SIGN_IN_SCREEN].screen;

    const { store, getByType } = renderWithContext(<Component />, {
      initialState,
    });

    const originalComponent = getByType(Component).children[0];

    if (typeof originalComponent === 'string') {
      throw "Can't access component props";
    }

    await store.dispatch(originalComponent.props.next());

    expect(joinStashedCommunity).toHaveBeenCalled();
    expect(loadHome).toHaveBeenCalled();
    expect(landOnStashedCommunityScreen).toHaveBeenCalled();
    expect(setOnboardingPersonId).toHaveBeenCalledWith('');
  });
  it('should navigate to mfa code screen', async () => {
    const email = 'test@test.com';
    const password = 'test1234';

    (joinStashedCommunity as jest.Mock).mockReturnValue(() =>
      Promise.resolve(),
    );
    (loadHome as jest.Mock).mockReturnValue(() => Promise.resolve());
    (landOnStashedCommunityScreen as jest.Mock).mockReturnValue(() =>
      Promise.resolve(),
    );

    const Component =
      DeepLinkJoinCommunityUnauthenticatedScreens[SIGN_IN_SCREEN].screen;

    const { store, getByType } = renderWithContext(<Component />, {
      initialState,
    });

    const originalComponent = getByType(Component).children[0];

    if (typeof originalComponent === 'string') {
      throw "Can't access component props";
    }

    await store.dispatch(
      originalComponent.props.next({
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
