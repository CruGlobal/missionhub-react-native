import { createStackNavigator } from 'react-navigation';

import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj, isAndroid } from '../../utils/common';
import { navigatePush, navigateReset } from '../../actions/navigation';
import { joinCommunity } from '../../actions/organizations';
import { firstTime, loadHome } from '../../actions/auth';
import {
  completeOnboarding,
  stashCommunityToJoin,
  joinStashedCommunuity,
  showNotificationPrompt,
  landOnStashedCommunityScreen,
} from '../../actions/onboardingProfile';
import DeepLinkConfirmJoinGroupScreen, {
  DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN,
} from '../../containers/Groups/DeepLinkConfirmJoinGroupScreen';
import WelcomeScreen, { WELCOME_SCREEN } from '../../containers/WelcomeScreen';
import SetupScreen, { SETUP_SCREEN } from '../../containers/SetupScreen';
import KeyLoginScreen, {
  KEY_LOGIN_SCREEN,
} from '../../containers/KeyLoginScreen';
import { NOTIFICATION_PRIMER_SCREEN } from '../../containers/NotificationPrimerScreen';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS } from '../../constants';

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
      dispatch(navigatePush(signin ? KEY_LOGIN_SCREEN : SETUP_SCREEN));
    }),
    buildTrackingObj('onboarding : welcome', 'onboarding'),
  ),
  [SETUP_SCREEN]: buildTrackedScreen(
    wrapNextAction(SetupScreen, () => async (dispatch, getState) => {
      dispatch(firstTime());
      dispatch(completeOnboarding());
      await dispatch(joinStashedCommunuity());
      await dispatch(showNotificationPrompt());
      await dispatch(loadHome());
      dispatch(landOnStashedCommunityScreen());
    }),
    buildTrackingObj('onboarding : name', 'onboarding'),
  ),
  [KEY_LOGIN_SCREEN]: buildTrackedScreen(
    wrapNextAction(KeyLoginScreen, () => async (dispatch, getState) => {
      await dispatch(joinStashedCommunuity());
      await dispatch(loadHome());
      dispatch(landOnStashedCommunityScreen());
    }),
    buildTrackingObj('auth : sign in', 'auth'),
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
