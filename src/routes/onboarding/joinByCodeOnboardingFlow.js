import { createStackNavigator } from 'react-navigation';

import { navigatePush } from '../../actions/navigation';
import { firstTime, loadHome } from '../../actions/auth';
import {
  completeOnboarding,
  stashCommunityToJoin,
  joinStashedCommunity,
  showNotificationPrompt,
  landOnStashedCommunityScreen,
} from '../../actions/onboardingProfile';
import JoinGroupScreen, {
  JOIN_GROUP_SCREEN,
} from '../../containers/Groups/JoinGroupScreen';
import { buildTrackedScreen, wrapNextAction, wrapNextScreen } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import { WELCOME_SCREEN } from '../../containers/WelcomeScreen';
import WelcomeScreen from '../../containers/WelcomeScreen';
import { SETUP_SCREEN } from '../../containers/SetupScreen';
import SetupScreen from '../../containers/SetupScreen';

export const JoinByCodeOnboardingFlowScreens = {
  [JOIN_GROUP_SCREEN]: buildTrackedScreen(
    wrapNextAction(JoinGroupScreen, ({ community }) => dispatch => {
      dispatch(stashCommunityToJoin({ community }));
      dispatch(navigatePush(WELCOME_SCREEN));
    }),
    buildTrackingObj('communities : join', 'communities', 'join'),
    { gesturesEnabled: true },
  ),
  [WELCOME_SCREEN]: buildTrackedScreen(
    wrapNextScreen(WelcomeScreen, SETUP_SCREEN),
    buildTrackingObj('onboarding : welcome', 'onboarding'),
  ),
  [SETUP_SCREEN]: buildTrackedScreen(
    wrapNextAction(SetupScreen, () => async dispatch => {
      dispatch(firstTime());
      dispatch(completeOnboarding());
      await dispatch(joinStashedCommunity());
      await dispatch(showNotificationPrompt());
      await dispatch(loadHome());
      dispatch(landOnStashedCommunityScreen());
    }),
    buildTrackingObj('onboarding : name', 'onboarding'),
  ),
};
export const JoinByCodeOnboardingFlowNavigator = createStackNavigator(
  JoinByCodeOnboardingFlowScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);
