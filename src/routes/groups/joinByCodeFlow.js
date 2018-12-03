import { createStackNavigator } from 'react-navigation';

import { navigateReset } from '../../actions/navigation';
import JoinGroupScreen, {
  JOIN_GROUP_SCREEN,
} from '../../containers/Groups/JoinGroupScreen';
import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import { MAIN_TABS } from '../../constants';
import { joinCommunity } from '../../actions/organizations';

export const JoinByCodeFlowScreens = {
  [JOIN_GROUP_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      JoinGroupScreen,
      ({ communityId, communityCode }) => async dispatch => {
        await dispatch(joinCommunity(communityId, communityCode));
        dispatch(navigateReset(MAIN_TABS, { startTab: 'groups' }));
      },
    ),
    buildTrackingObj('communities : join', 'communities', 'join'),
    { gesturesEnabled: true },
  ),
};
export const JoinByCodeFlowNavigator = createStackNavigator(
  JoinByCodeFlowScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);
