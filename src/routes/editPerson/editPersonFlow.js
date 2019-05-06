import { createStackNavigator } from 'react-navigation';

import { NOTIFICATION_PROMPT_TYPES, MAIN_TABS } from '../../constants';
import {
  navigatePush,
  navigateReset,
  navigateBack,
} from '../../actions/navigation';
import { firstTime, loadHome } from '../../actions/auth/userData';
import {
  completeOnboarding,
  stashCommunityToJoin,
  joinStashedCommunity,
  landOnStashedCommunityScreen,
} from '../../actions/onboardingProfile';
import { showReminderOnLoad } from '../../actions/notifications';
import { navigateToOrg } from '../../actions/organizations';
import AddContactScreen, {
  ADD_CONTACT_SCREEN,
} from '../../containers/AddContactScreen';
import PersonStageScreen, {
  PERSON_STAGE_SCREEN,
} from '../../containers/PersonStageScreen';
import PersonSelectStepScreen, {
  PERSON_SELECT_STEP_SCREEN,
} from '../../containers/PersonSelectStepScreen';
import { GROUP_MEMBERS } from '../../containers/Groups/GroupScreen';
import { buildTrackedScreen, wrapNextAction, wrapNextScreen } from '../helpers';
import { buildTrackingObj } from '../../utils/common';

export const EditPersonFlowScreens = onFlowComplete => ({
  [ADD_CONTACT_SCREEN]: buildTrackedScreen(
    wrapNextAction(AddContactScreen, () => dispatch => {
      dispatch(navigateBack());
    }),
    buildTrackingObj(),
  ),
});

export const EditPersonFlowNavigator = createStackNavigator(
  EditPersonFlowScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);
