import { createStackNavigator } from 'react-navigation';

import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { joinCommunity } from '../../actions/organizations';
import { setScrollGroups } from '../../actions/swipe';
import DeepLinkConfirmJoinGroupScreen, {
  DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN,
} from '../../containers/Groups/DeepLinkConfirmJoinGroupScreen';
import WelcomeScreen, { WELCOME_SCREEN } from '../../containers/WelcomeScreen';
import SetupScreen, { SETUP_SCREEN } from '../../containers/SetupScreen';
import KeyLoginScreen, {
  KEY_LOGIN_SCREEN,
} from '../../containers/KeyLoginScreen';
import {
  GROUP_SCREEN,
  USER_CREATED_GROUP_SCREEN,
} from '../../containers/Groups/GroupScreen';

export const DeepLinkJoinCommunityUnauthenticatedScreens = {
  [DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN]: buildTrackedScreen(
    DeepLinkConfirmJoinGroupScreen,
    ({ community }) => async dispatch => {
      await dispatch(
        joinCommunity(community.id, null, community.community_url),
      );
      dispatch(setScrollGroups());
    },
  ),
  [WELCOME_SCREEN]: buildTrackedScreen(WelcomeScreen, () => {}),
  [SETUP_SCREEN]: buildTrackedScreen(SetupScreen, () => {}),
  [KEY_LOGIN_SCREEN]: buildTrackedScreen(KeyLoginScreen, () => {}),
};
export const DeepLinkJoinCommunityUnauthenticatedNavigator = createStackNavigator(
  DeepLinkJoinCommunityUnauthenticatedScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);
