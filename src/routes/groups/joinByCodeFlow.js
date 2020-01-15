import { createStackNavigator } from 'react-navigation-stack';

import { navigateToMainTabs } from '../../actions/navigation';
import JoinGroupScreen, {
  JOIN_GROUP_SCREEN,
} from '../../containers/Groups/JoinGroupScreen';
import NotificationPrimerScreen, {
  NOTIFICATION_PRIMER_SCREEN,
} from '../../containers/NotificationPrimerScreen';
import NotificationOffScreen, {
  NOTIFICATION_OFF_SCREEN,
} from '../../containers/NotificationOffScreen';
import { wrapNextAction } from '../helpers';
import { GROUPS_TAB, NOTIFICATION_PROMPT_TYPES } from '../../constants';
import { checkNotifications } from '../../actions/notifications';
import { joinCommunity } from '../../actions/organizations';
import { setScrollGroups } from '../../actions/swipe';

export const JoinByCodeFlowScreens = {
  [JOIN_GROUP_SCREEN]: {
    screen: wrapNextAction(
      JoinGroupScreen,
      ({ community }) => async dispatch => {
        await dispatch(joinCommunity(community.id, community.community_code));
        dispatch(setScrollGroups(community.id));

        dispatch(
          checkNotifications(NOTIFICATION_PROMPT_TYPES.JOIN_COMMUNITY, () =>
            dispatch(navigateToMainTabs(GROUPS_TAB)),
          ),
        );
      },
    ),
    defaultNavigationOptions: { gesturesEnabled: true },
  },
  [NOTIFICATION_PRIMER_SCREEN]: wrapNextAction(NotificationPrimerScreen, () =>
    navigateToMainTabs(GROUPS_TAB),
  ),
  [NOTIFICATION_OFF_SCREEN]: wrapNextAction(NotificationOffScreen, () =>
    navigateToMainTabs(GROUPS_TAB),
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
