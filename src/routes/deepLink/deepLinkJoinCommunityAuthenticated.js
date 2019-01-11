import { createStackNavigator } from 'react-navigation';

import { navigateReset } from '../../actions/navigation';
import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import { joinCommunity, getMyCommunities } from '../../actions/organizations';
import { setScrollGroups } from '../../actions/swipe';
import { loadHome } from '../../actions/auth';
import DeepLinkConfirmJoinGroupScreen, {
  DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN,
} from '../../containers/Groups/DeepLinkConfirmJoinGroupScreen';
import {
  GROUP_SCREEN,
  USER_CREATED_GROUP_SCREEN,
} from '../../containers/Groups/GroupScreen';

export const DeepLinkJoinCommunityAuthenticatedScreens = {
  [DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      DeepLinkConfirmJoinGroupScreen,
      ({ community }) => async dispatch => {
        await dispatch(
          joinCommunity(community.id, null, community.community_url),
        );
        await dispatch(loadHome());
        dispatch(setScrollGroups(community.id));
        dispatch(
          navigateReset(
            community.user_created ? USER_CREATED_GROUP_SCREEN : GROUP_SCREEN,
            {
              organization: community,
            },
          ),
        );
      },
    ),
    buildTrackingObj('communities : join', 'communities', 'join'),
    { gesturesEnabled: true },
  ),
};
export const DeepLinkJoinCommunityAuthenticatedNavigator = createStackNavigator(
  DeepLinkJoinCommunityAuthenticatedScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);
