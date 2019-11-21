import { createStackNavigator } from 'react-navigation-stack';
import { ThunkDispatch } from 'redux-thunk';

import {
  buildTrackedScreen,
  wrapNextAction,
  wrapNextScreenFn,
} from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import { navigatePush } from '../../actions/navigation';
import { loadHome } from '../../actions/auth/userData';
import {
  joinStashedCommunity,
  landOnStashedCommunityScreen,
  setOnboardingCommunity,
  setOnboardingPersonId,
} from '../../actions/onboarding';
import DeepLinkConfirmJoinGroupScreen, {
  DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN,
} from '../../containers/Groups/DeepLinkConfirmJoinGroupScreen';
import WelcomeScreen, { WELCOME_SCREEN } from '../../containers/WelcomeScreen';
import SetupScreen, { SETUP_SCREEN } from '../../containers/SetupScreen';
import { SIGN_IN_SCREEN } from '../../containers/Auth/SignInScreen';
import { authFlowGenerator } from '../auth/authFlowGenerator';
import { onboardingFlowGenerator } from '../onboarding/onboardingFlowGenerator';
import { GET_STARTED_SCREEN } from '../../containers/GetStartedScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../containers/CelebrationScreen';

export const DeepLinkJoinCommunityUnauthenticatedScreens = {
  [DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      DeepLinkConfirmJoinGroupScreen,
      ({ community }) => dispatch => {
        dispatch(setOnboardingCommunity(community));
        dispatch(navigatePush(WELCOME_SCREEN, { allowSignIn: true }));
      },
    ),
    buildTrackingObj('communities : join', 'communities', 'join'),
  ),
  ...onboardingFlowGenerator(),
  [WELCOME_SCREEN]: buildTrackedScreen(
    wrapNextScreenFn(WelcomeScreen, ({ signin }) =>
      signin ? SIGN_IN_SCREEN : SETUP_SCREEN,
    ),
    buildTrackingObj('onboarding : welcome', 'onboarding'),
  ),
  [SETUP_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      SetupScreen,
      () => async dispatch => {
        await dispatch(joinStashedCommunity());
        dispatch(
          navigatePush(GET_STARTED_SCREEN, {
            isMe: true,
          }),
        );
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
      () => async (dispatch: ThunkDispatch<{}, {}, any>) => {
        await dispatch(loadHome());
        dispatch(landOnStashedCommunityScreen());
        dispatch(setOnboardingPersonId(''));
      },
    ),
    buildTrackingObj('onboarding : complete', 'onboarding'),
  ),
  ...authFlowGenerator({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    completeAction: async (dispatch: ThunkDispatch<{}, {}, any>) => {
      await dispatch(joinStashedCommunity());
      await dispatch(loadHome());
      dispatch(landOnStashedCommunityScreen());
      dispatch(setOnboardingPersonId(''));
    },
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
