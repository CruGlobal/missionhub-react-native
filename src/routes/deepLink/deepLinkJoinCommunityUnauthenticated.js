import { createStackNavigator } from 'react-navigation';
import i18next from 'i18next';

import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj, isAndroid } from '../../utils/common';
import { navigatePush, navigateReset } from '../../actions/navigation';
import { joinCommunity } from '../../actions/organizations';
import { setScrollGroups } from '../../actions/swipe';
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
import NotificationPrimerScreen, {
  NOTIFICATION_PRIMER_SCREEN,
} from '../../containers/NotificationPrimerScreen';
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
  ),
  [WELCOME_SCREEN]: buildTrackedScreen(
    wrapNextAction(WelcomeScreen, ({ signin }) => dispatch => {
      dispatch(navigatePush(signin ? KEY_LOGIN_SCREEN : SETUP_SCREEN));
    }),
  ),
  [SETUP_SCREEN]: buildTrackedScreen(
    wrapNextAction(SetupScreen, () => (dispatch, getState) => {
      dispatch(firstTime());
      joinCommunityAndFinishOnboarding(dispatch, getState, false);
    }),
  ),
  [KEY_LOGIN_SCREEN]: buildTrackedScreen(
    wrapNextAction(KeyLoginScreen, () => (dispatch, getState) => {
      joinCommunityAndFinishOnboarding(dispatch, getState, true);
    }),
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

const joinCommunityAndFinishOnboarding = async (
  dispatch,
  getState,
  isSignIn,
) => {
  dispatch(completeOnboarding());

  const { community } = getState().profile;
  await dispatch(joinCommunity(community.id, community.community_code));

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
