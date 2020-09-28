import { createStackNavigator } from 'react-navigation-stack';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../containers/CelebrationScreen';
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
import SetupScreen, { SETUP_SCREEN } from '../../containers/SetupScreen';
import { Organization } from '../../reducers/organizations';
import { GET_STARTED_SCREEN } from '../../containers/GetStartedScreen/constants';
import { RootState } from '../../reducers';

import { onboardingFlowGenerator } from './onboardingFlowGenerator';

export const JoinByCodeOnboardingFlowScreens = {
  [JOIN_GROUP_SCREEN]: {
    screen: wrapNextAction(
      JoinGroupScreen,
      ({ community }: { community: Organization }) => (
        dispatch: ThunkDispatch<RootState, never, AnyAction>,
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
    () => async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
      await dispatch(joinStashedCommunity());
      dispatch(navigatePush(GET_STARTED_SCREEN));
    },
    {
      isMe: true,
    },
  ),
  [CELEBRATION_SCREEN]: wrapNextAction(
    CelebrationScreen,
    () => (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
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
