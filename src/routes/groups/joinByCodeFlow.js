import { createStackNavigator } from 'react-navigation-stack';

import { navigateToMainTabs } from '../../actions/navigation';
import JoinGroupScreen, {
  JOIN_GROUP_SCREEN,
} from '../../containers/Groups/JoinGroupScreen';
import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import { GROUPS_TAB, NOTIFICATION_PROMPT_TYPES } from '../../constants';
import { checkNotifications } from '../../actions/notifications';
import { joinCommunity } from '../../actions/organizations';
import { setScrollGroups } from '../../actions/swipe';

export const JoinByCodeFlowScreens = {
  [JOIN_GROUP_SCREEN]: buildTrackedScreen(
    wrapNextAction(JoinGroupScreen, ({ community }) => async dispatch => {
      await dispatch(joinCommunity(community.id, community.community_code));
      await dispatch(
        checkNotifications(NOTIFICATION_PROMPT_TYPES.JOIN_COMMUNITY, true),
      );
      dispatch(setScrollGroups(community.id));
      dispatch(navigateToMainTabs(GROUPS_TAB));
    }),
    buildTrackingObj('communities : join', 'communities', 'join'),
    { gesturesEnabled: true },
  ),
};
export const JoinByCodeFlowNavigator = createStackNavigator(
  JoinByCodeFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);
