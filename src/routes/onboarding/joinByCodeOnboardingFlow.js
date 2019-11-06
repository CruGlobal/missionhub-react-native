import { createStackNavigator } from 'react-navigation-stack';

import { NOTIFICATION_PROMPT_TYPES } from '../../constants';
import { navigatePush } from '../../actions/navigation';
import { firstTime, loadHome } from '../../actions/auth/userData';
import {
  completeOnboarding,
  stashCommunityToJoin,
  joinStashedCommunity,
  landOnStashedCommunityScreen,
} from '../../actions/onboardingProfile';
import { showReminderOnLoad } from '../../actions/notifications';
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
      await dispatch(
        showReminderOnLoad(NOTIFICATION_PROMPT_TYPES.ONBOARDING, true),
      );
      await dispatch(loadHome());
      dispatch(landOnStashedCommunityScreen());
    }),
    buildTrackingObj('onboarding : name', 'onboarding'),
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
