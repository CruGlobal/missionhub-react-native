import { createStackNavigator } from 'react-navigation';

import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import { navigatePush } from '../../actions/navigation';
import { firstTime, loadHome } from '../../actions/auth/userData';
import {
  completeOnboarding,
  stashCommunityToJoin,
  joinStashedCommunity,
  showNotificationPrompt,
  landOnStashedCommunityScreen,
} from '../../actions/onboardingProfile';
import DeepLinkConfirmJoinGroupScreen, {
  DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN,
} from '../../containers/Groups/DeepLinkConfirmJoinGroupScreen';
import WelcomeScreen, { WELCOME_SCREEN } from '../../containers/WelcomeScreen';
import SetupScreen, { SETUP_SCREEN } from '../../containers/SetupScreen';
import SignInScreen, {
  SIGN_IN_SCREEN,
} from '../../containers/Auth/SignInScreen';
import MFACodeScreen, {
  MFA_CODE_SCREEN,
} from '../../containers/Auth/MFACodeScreen';

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
      await dispatch(showNotificationPrompt());
      await dispatch(finishAuth());
    }),
    buildTrackingObj('onboarding : name', 'onboarding'),
  ),
  [SIGN_IN_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      SignInScreen,
      ({ requires2FA, email, password } = {}) =>
        requires2FA
          ? navigatePush(MFA_CODE_SCREEN, { email, password })
          : finishAuth(),
    ),
    buildTrackingObj('auth : sign in', 'auth'),
  ),
  [MFA_CODE_SCREEN]: buildTrackedScreen(
    wrapNextAction(MFACodeScreen, finishAuth),
    buildTrackingObj('auth : verification', 'auth'),
  ),
};

export const DeepLinkJoinCommunityUnauthenticatedNavigator = createStackNavigator(
  DeepLinkJoinCommunityUnauthenticatedScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);
