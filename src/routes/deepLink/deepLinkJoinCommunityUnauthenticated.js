import { createStackNavigator } from 'react-navigation';
import i18next from 'i18next';

import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj, isAndroid } from '../../utils/common';
import { navigatePush, navigateReset } from '../../actions/navigation';
import { joinCommunity } from '../../actions/organizations';
import { firstTime, loadHome } from '../../actions/auth';
import {
  completeOnboarding,
  stashCommunityToJoin,
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
import {
  GROUP_SCREEN,
  USER_CREATED_GROUP_SCREEN,
} from '../../containers/Groups/GroupScreen';
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
      await joinCommunityAndFinish(dispatch, getState, false);
    }),
    buildTrackingObj('onboarding : name', 'onboarding'),
  ),
  [KEY_LOGIN_SCREEN]: buildTrackedScreen(
    wrapNextAction(KeyLoginScreen, () => async (dispatch, getState) => {
      await joinCommunityAndFinish(dispatch, getState, true);
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

const joinCommunityAndFinish = async (dispatch, getState, isSignIn) => {
  const { community } = getState().profile;
  await dispatch(joinCommunity(community.id, null, community.community_url));

  const notificationScreensPromise =
    isAndroid || isSignIn
      ? Promise.resolve()
      : new Promise(resolve =>
          dispatch(
            navigatePush(NOTIFICATION_PRIMER_SCREEN, {
              onComplete: resolve,
              descriptionText: i18next.t(
                'notificationPrimer:onboardingDescription',
              ),
            }),
          ),
        );

  await Promise.all([dispatch(loadHome()), notificationScreensPromise]);

  dispatch(
    navigateReset(
      community.user_created ? USER_CREATED_GROUP_SCREEN : GROUP_SCREEN,
      {
        organization: community,
      },
    ),
  );
  dispatch(trackActionWithoutData(ACTIONS.SELECT_JOINED_COMMUNITY));
};
