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
import { NOTIFICATION_PRIMER_SCREEN } from '../../../containers/NotificationPrimerScreen';
import { NOTIFICATION_OFF_SCREEN } from '../../../containers/NotificationOffScreen';
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

const mockMath = Object.create(global.Math);
mockMath.random = () => 0;
global.Math = mockMath;

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
  (setOnboardingCommunity as jest.Mock).mockReturnValue(() =>
    Promise.resolve(),
  );
  (joinStashedCommunity as jest.Mock).mockReturnValue(() => Promise.resolve());
  (landOnStashedCommunityScreen as jest.Mock).mockReturnValue(() =>
    Promise.resolve(),
  );
  (setOnboardingPersonId as jest.Mock).mockReturnValue(() => Promise.resolve());
});

const renderScreen = (
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  Component: (props: any) => JSX.Element,
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  navParams: any = {},
) => {
  const { store, getByType, snapshot } = renderWithContext(<Component />, {
    initialState,
    navParams,
  });

  const originalComponent = getByType(Component).children[0];

  if (typeof originalComponent === 'string') {
    throw "Can't access component props";
  }

  const next = originalComponent.props.next;

  return { store, next, snapshot };
};

describe('JoinGroupScreen next', () => {
  it('should fire required next actions', () => {
    const Component = JoinByCodeOnboardingFlowScreens[JOIN_GROUP_SCREEN].screen;
    const { store, next } = renderScreen(Component);

    store.dispatch(next({ community }));

    expect(setOnboardingCommunity).toHaveBeenCalledWith(community);
    expect(navigationActions.navigatePush).toHaveBeenCalledWith(WELCOME_SCREEN);
  });
});

describe('SetupScreen next', () => {
  it('should fire required next actions', async () => {
    const Component = JoinByCodeOnboardingFlowScreens[SETUP_SCREEN];
    const { store, next } = renderScreen(Component);

    await store.dispatch(next());

    expect(joinStashedCommunity).toHaveBeenCalled();
    expect(navigationActions.navigatePush).toHaveBeenCalledWith(
      GET_STARTED_SCREEN,
    );
  });
});

describe('NotificationPrimerScreen next', () => {
  it('should fire required next actions', () => {
    const Component =
      JoinByCodeOnboardingFlowScreens[NOTIFICATION_PRIMER_SCREEN];
    const { store, next } = renderScreen(Component);

    store.dispatch(next());

    expect(navigationActions.navigatePush).toHaveBeenCalledWith(
      CELEBRATION_SCREEN,
      undefined,
    );
  });
});

describe('NotificationOffScreen next', () => {
  it('should fire required next actions', () => {
    const Component = JoinByCodeOnboardingFlowScreens[NOTIFICATION_OFF_SCREEN];
    const { store, next } = renderScreen(Component);

    store.dispatch(next());

    expect(navigationActions.navigatePush).toHaveBeenCalledWith(
      CELEBRATION_SCREEN,
      undefined,
    );
  });
});

describe('CelebrationScreen next', () => {
  it('should fire required next actions', () => {
    const Component = JoinByCodeOnboardingFlowScreens[CELEBRATION_SCREEN];
    const { store, next } = renderScreen(Component);

    store.dispatch(next());

    expect(landOnStashedCommunityScreen).toHaveBeenCalled();
    expect(setOnboardingPersonId).toHaveBeenCalled();
  });
});
