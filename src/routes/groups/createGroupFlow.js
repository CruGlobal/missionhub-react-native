import { createStackNavigator } from 'react-navigation';

import { navigateReset } from '../../actions/navigation';
import JoinGroupScreen, {
  JOIN_GROUP_SCREEN,
} from '../../containers/Groups/JoinGroupScreen';
import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import { MAIN_TABS } from '../../constants';

export const CreateGroupFlowScreens = {
  [JOIN_GROUP_SCREEN]: buildTrackedScreen(
    wrapNextAction(JoinGroupScreen, () => dispatch =>
      dispatch(navigateReset(MAIN_TABS, { startTab: 'groups' })),
    ),
    buildTrackingObj('communities : join', 'communities', 'join'),
    { gesturesEnabled: true },
  ),
};
export const CreateGroupFlowNavigator = createStackNavigator(
  CreateGroupFlowScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);
