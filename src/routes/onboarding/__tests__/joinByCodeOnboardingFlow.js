import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { JOIN_GROUP_SCREEN } from '../../../containers/Groups/JoinGroupScreen';
import { JoinByCodeOnboardingFlowScreens } from '../joinByCodeOnboardingFlow';
import { renderShallow } from '../../../../testUtils';
import { firstTime, loadHome } from '../../../actions/auth';
import {
  completeOnboarding,
  stashCommunityToJoin,
  joinStashedCommunity,
  showNotificationPrompt,
  landOnStashedCommunityScreen,
} from '../../../actions/onboardingProfile';
import { WELCOME_SCREEN } from '../../../containers/WelcomeScreen';
import { SETUP_SCREEN } from '../../../containers/SetupScreen';
import * as navigationActions from '../../../actions/navigation';

jest.mock('../../../actions/api');
jest.mock('../../../actions/auth');
jest.mock('../../../actions/onboardingProfile');
jest.mock('../../../actions/navigation');

const community = { id: '1', community_code: '123456' };

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
  navigationActions.navigatePush.mockReturnValue(() => Promise.resolve());
});

describe('JoinGroupScreen next', () => {
  it('should fire required next actions', async () => {
    stashCommunityToJoin.mockReturnValue(() => Promise.resolve());

    const Component = JoinByCodeOnboardingFlowScreens[JOIN_GROUP_SCREEN].screen;

    await store.dispatch(
      renderShallow(<Component />, store)
        .instance()
        .props.next({
          community,
        }),
    );

    expect(stashCommunityToJoin).toHaveBeenCalledWith({ community });
    expect(navigationActions.navigatePush).toHaveBeenCalledWith(WELCOME_SCREEN);
  });
});

describe('WelcomeScreen next', () => {
  it('should fire required next actions', async () => {
    const Component = JoinByCodeOnboardingFlowScreens[WELCOME_SCREEN].screen;

    await store.dispatch(
      renderShallow(<Component navigation={{ state: {} }} />, store)
        .instance()
        .props.next(),
    );

    expect(navigationActions.navigatePush).toHaveBeenCalledWith(
      SETUP_SCREEN,
      undefined,
    );
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

    const Component = JoinByCodeOnboardingFlowScreens[SETUP_SCREEN].screen;

    await store.dispatch(
      renderShallow(<Component />, store)
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
