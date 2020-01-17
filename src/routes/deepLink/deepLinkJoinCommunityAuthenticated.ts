import { createStackNavigator } from 'react-navigation-stack';

import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import { navigateToCommunity } from '../../actions/navigation';
import { joinCommunity } from '../../actions/organizations';
import { setScrollGroups } from '../../actions/swipe';
import { loadHome } from '../../actions/auth/userData';
import DeepLinkConfirmJoinGroupScreen, {
  DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN,
} from '../../containers/Groups/DeepLinkConfirmJoinGroupScreen';

export const DeepLinkJoinCommunityAuthenticatedScreens = {
  [DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      DeepLinkConfirmJoinGroupScreen,
      ({ community }) => async dispatch => {
        const { id, community_url } = community;
        // @ts-ignore
        await dispatch(joinCommunity(id, null, community_url));
        await dispatch(loadHome());
        dispatch(setScrollGroups(id));
        dispatch(navigateToCommunity(community));
      },
    ),
    // @ts-ignore
    buildTrackingObj('communities : join', 'communities', 'join'),
    { gesturesEnabled: true },
  ),
};
export const DeepLinkJoinCommunityAuthenticatedNavigator = createStackNavigator(
  DeepLinkJoinCommunityAuthenticatedScreens,
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);
