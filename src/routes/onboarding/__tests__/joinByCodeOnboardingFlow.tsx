import React from 'react';

import { JOIN_GROUP_SCREEN } from '../../../containers/Groups/JoinGroupScreen';
import { JoinByCodeOnboardingFlowScreens } from '../joinByCodeOnboardingFlow';
import { renderWithContext } from '../../../../testUtils';
import {
  setOnboardingCommunity,
  joinStashedCommunity,
  landOnStashedCommunityScreen,
  setOnboardingPersonId,
} from '../../../actions/onboarding';
import { WELCOME_SCREEN } from '../../../containers/WelcomeScreen';
import { SETUP_SCREEN } from '../../../containers/SetupScreen';
import * as navigationActions from '../../../actions/navigation';
import { GET_STARTED_SCREEN } from '../../../containers/GetStartedScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';

jest.mock('../../../actions/api');
jest.mock('../../../actions/auth/userData');
jest.mock('../../../actions/onboarding');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/notifications');
jest.mock('../../../utils/hooks/useLogoutOnBack', () => ({
  useLogoutOnBack: jest.fn(),
}));

const community = { id: '1', community_code: '123456' };

const initialState = {
  auth: { person: { id: '1' } },
  onboarding: {
    community,
  },
};

beforeEach(() => {
  (navigationActions.navigatePush as jest.Mock).mockReturnValue(() =>
    Promise.resolve(),
  );
});

describe('JoinGroupScreen next', () => {
  it('should fire required next actions', async () => {
    (setOnboardingCommunity as jest.Mock).mockReturnValue(() =>
      Promise.resolve(),
    );

    const Component = JoinByCodeOnboardingFlowScreens[JOIN_GROUP_SCREEN].screen;

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
    expect(navigationActions.navigatePush).toHaveBeenCalledWith(WELCOME_SCREEN);
  });
});

describe('SetupScreen next', () => {
  it('should fire required next actions', async () => {
    (joinStashedCommunity as jest.Mock).mockReturnValue(() =>
      Promise.resolve(),
    );

    const Component = JoinByCodeOnboardingFlowScreens[SETUP_SCREEN];

    const { store, getByType } = renderWithContext(<Component />, {
      initialState,
    });

    const originalComponent = getByType(Component).children[0];

    if (typeof originalComponent === 'string') {
      throw "Can't access component props";
    }

    await store.dispatch(originalComponent.props.next());

    expect(joinStashedCommunity).toHaveBeenCalled();
    expect(navigationActions.navigatePush).toHaveBeenCalledWith(
      GET_STARTED_SCREEN,
    );
  });
});

describe('CelebrationScreen next', () => {
  it('should fire required next actions', async () => {
    (landOnStashedCommunityScreen as jest.Mock).mockReturnValue(() =>
      Promise.resolve(),
    );
    (setOnboardingPersonId as jest.Mock).mockReturnValue(() =>
      Promise.resolve(),
    );

    const Component = JoinByCodeOnboardingFlowScreens[CELEBRATION_SCREEN];

    const { store, getByType } = renderWithContext(<Component />, {
      initialState,
    });

    const originalComponent = getByType(Component).children[0];

    if (typeof originalComponent === 'string') {
      throw "Can't access component props";
    }

    await store.dispatch(originalComponent.props.next());

    expect(landOnStashedCommunityScreen).toHaveBeenCalled();
    expect(setOnboardingPersonId).toHaveBeenCalled();
  });
});
