import { createStackNavigator } from 'react-navigation-stack';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { CELEBRATION_SCREEN } from '../../containers/CelebrationScreen';
import CelebrationScreen from '../../containers/CelebrationScreen';
import { navigatePush } from '../../actions/navigation';
import {
  joinStashedCommunity,
  landOnStashedCommunityScreen,
  setOnboardingCommunity,
  setOnboardingPersonId,
} from '../../actions/onboarding';
import JoinGroupScreen, {
  JOIN_GROUP_SCREEN,
} from '../../containers/Groups/JoinGroupScreen';
import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import { WELCOME_SCREEN } from '../../containers/WelcomeScreen';
import { SETUP_SCREEN } from '../../containers/SetupScreen';
import SetupScreen from '../../containers/SetupScreen';
import { Organization } from '../../reducers/organizations';
import { GET_STARTED_SCREEN } from '../../containers/GetStartedScreen';

import { onboardingFlowGenerator } from './onboardingFlowGenerator';

export const JoinByCodeOnboardingFlowScreens = {
  [JOIN_GROUP_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      JoinGroupScreen,
      ({ community }: { community: Organization }) => (
        dispatch: ThunkDispatch<{}, {}, AnyAction>,
      ) => {
        dispatch(setOnboardingCommunity(community));
        dispatch(navigatePush(WELCOME_SCREEN));
      },
    ),
    buildTrackingObj('communities : join', 'communities', 'join'),
    { gesturesEnabled: true },
  ),
  ...onboardingFlowGenerator(),
  [SETUP_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      SetupScreen,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      () => async (dispatch: ThunkDispatch<{}, {}, any>) => {
        await dispatch(joinStashedCommunity());
        dispatch(navigatePush(GET_STARTED_SCREEN));
      },
      {
        isMe: true,
      },
    ),
    buildTrackingObj('onboarding : name', 'onboarding'),
  ),
  [CELEBRATION_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      CelebrationScreen,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      () => (dispatch: ThunkDispatch<{}, {}, any>) => {
        dispatch(landOnStashedCommunityScreen());
        dispatch(setOnboardingPersonId(''));
      },
    ),
    buildTrackingObj('onboarding : complete', 'onboarding'),
  ),
};
export const JoinByCodeOnboardingFlowNavigator = createStackNavigator(
  JoinByCodeOnboardingFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);
