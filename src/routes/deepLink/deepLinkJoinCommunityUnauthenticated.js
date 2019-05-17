import { createStackNavigator } from 'react-navigation';

import { NOTIFICATION_PROMPT_TYPES } from '../../constants';
import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import { navigatePush } from '../../actions/navigation';
import { firstTime, loadHome } from '../../actions/auth/userData';
import {
  completeOnboarding,
  stashCommunityToJoin,
  joinStashedCommunity,
  landOnStashedCommunityScreen,
} from '../../actions/onboardingProfile';
import { showReminderOnLoad } from '../../actions/notifications';
import DeepLinkConfirmJoinGroupScreen, {
  DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN,
} from '../../containers/Groups/DeepLinkConfirmJoinGroupScreen';
import WelcomeScreen, { WELCOME_SCREEN } from '../../containers/WelcomeScreen';
import SetupScreen, { SETUP_SCREEN } from '../../containers/SetupScreen';
import { SIGN_IN_SCREEN } from '../../containers/Auth/SignInScreen';
import { authFlowGenerator } from '../auth/authFlowGenerator';

const finishAuth = () => async dispatch => {
  await dispatch(joinStashedCommunity());
  await dispatch(loadHome());
  dispatch(landOnStashedCommunityScreen());
};

export const DeepLinkJoinCommunityUnauthenticatedScreens = {
  [DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      DeepLinkConfirmJoinGroupScreen,
      ({ community }) => dispatch => {
        dispatch(stashCommunityToJoin({ community }));
        dispatch(navigatePush(WELCOME_SCREEN, { allowSignIn: true }));
      },
    ),
    buildTrackingObj('communities : join', 'communities', 'join'),
  ),
  [WELCOME_SCREEN]: buildTrackedScreen(
    wrapNextAction(WelcomeScreen, ({ signin }) => dispatch => {
      dispatch(navigatePush(signin ? SIGN_IN_SCREEN : SETUP_SCREEN));
    }),
    buildTrackingObj('onboarding : welcome', 'onboarding'),
  ),
  [SETUP_SCREEN]: buildTrackedScreen(
    wrapNextAction(SetupScreen, () => async dispatch => {
      dispatch(firstTime());
      dispatch(completeOnboarding());
      await dispatch(
        showReminderOnLoad(NOTIFICATION_PROMPT_TYPES.ONBOARDING, true),
      );
      dispatch(finishAuth());
    }),
    buildTrackingObj('onboarding : name', 'onboarding'),
  ),
  ...authFlowGenerator({
    completeAction: finishAuth(),
    includeSignUp: false,
  }),
};

export const DeepLinkJoinCommunityUnauthenticatedNavigator = createStackNavigator(
  DeepLinkJoinCommunityUnauthenticatedScreens,
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);
