import { createStackNavigator } from 'react-navigation';
import i18next from 'i18next';

import { navigatePush, navigateReset } from '../../actions/navigation';
import { firstTime, loadHome } from '../../actions/auth';
import {
  completeOnboarding,
  stashCommunityToJoin,
} from '../../actions/onboardingProfile';
import JoinGroupScreen, {
  JOIN_GROUP_SCREEN,
} from '../../containers/Groups/JoinGroupScreen';
import { buildTrackedScreen, wrapNextAction, wrapNextScreen } from '../helpers';
import { buildTrackingObj, isAndroid } from '../../utils/common';
import { WELCOME_SCREEN } from '../../containers/WelcomeScreen';
import WelcomeScreen from '../../containers/WelcomeScreen';
import { SETUP_SCREEN } from '../../containers/SetupScreen';
import SetupScreen from '../../containers/SetupScreen';
import { NOTIFICATION_PRIMER_SCREEN } from '../../containers/NotificationPrimerScreen';
import { joinCommunity } from '../../actions/organizations';
import {
  GROUP_SCREEN,
  USER_CREATED_GROUP_SCREEN,
} from '../../containers/Groups/GroupScreen';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS } from '../../constants';

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
    wrapNextAction(SetupScreen, () => async (dispatch, getState) => {
      dispatch(firstTime());
      dispatch(completeOnboarding());

      const { community } = getState().profile;
      await dispatch(joinCommunity(community.id, community.community_code));

      const notificationScreensPromise = isAndroid
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
