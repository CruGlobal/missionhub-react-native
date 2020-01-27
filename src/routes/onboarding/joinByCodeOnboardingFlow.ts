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
import { wrapNextAction } from '../helpers';
import { WELCOME_SCREEN } from '../../containers/WelcomeScreen';
import { SETUP_SCREEN } from '../../containers/SetupScreen';
import SetupScreen from '../../containers/SetupScreen';
import { Organization } from '../../reducers/organizations';
import { GET_STARTED_SCREEN } from '../../containers/GetStartedScreen';

import { onboardingFlowGenerator } from './onboardingFlowGenerator';

export const JoinByCodeOnboardingFlowScreens = {
  [JOIN_GROUP_SCREEN]: {
    screen: wrapNextAction(
      JoinGroupScreen,
      ({ community }: { community: Organization }) => (
        dispatch: ThunkDispatch<{}, {}, AnyAction>,
      ) => {
        dispatch(setOnboardingCommunity(community));
        dispatch(navigatePush(WELCOME_SCREEN));
      },
    ),
    navigationOptions: { gesturesEnabled: true },
  },
  ...onboardingFlowGenerator(),
  [SETUP_SCREEN]: wrapNextAction(
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
  [CELEBRATION_SCREEN]: wrapNextAction(
    CelebrationScreen,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => (dispatch: ThunkDispatch<{}, {}, any>) => {
      dispatch(landOnStashedCommunityScreen());
      dispatch(setOnboardingPersonId(''));
    },
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
