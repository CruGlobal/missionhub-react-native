import { createStackNavigator } from 'react-navigation';

import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { firstTime, loadHome } from '../../actions/auth';
import {
  completeOnboarding,
  stashCommunityToJoin,
  joinStashedCommunity,
  showNotificationPrompt,
  landOnStashedCommunityScreen,
} from '../../actions/onboardingProfile';
import { STEP_NOTE } from '../../constants';
import AddStepScreen, { ADD_STEP_SCREEN } from '../../containers/AddStepScreen';
import StageScreen, { STAGE_SCREEN } from '../../containers/StageScreen';
import PersonStageScreen, {
  PERSON_STAGE_SCREEN,
} from '../../containers/PersonStageScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../containers/CelebrationScreen';

export const CompleteStepFlowScreens = {
  [ADD_STEP_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      AddStepScreen,
      ({ text, receiver, organization }) => dispatch => {
        console.log(text);
        console.log(receiver);
        console.log(organization);

        dispatch(navigatePush(STAGE_SCREEN));
      },
      { type: STEP_NOTE },
    ),
    buildTrackingObj(),
  ),
  [STAGE_SCREEN]: buildTrackedScreen(
    wrapNextAction(StageScreen, ({ signin }) => dispatch => {}),
    buildTrackingObj(),
  ),
  [PERSON_STAGE_SCREEN]: buildTrackedScreen(
    wrapNextAction(PersonStageScreen, () => async dispatch => {}),
    buildTrackingObj(),
  ),
  [CELEBRATION_SCREEN]: buildTrackedScreen(
    wrapNextAction(CelebrationScreen, () => async dispatch => {}),
    buildTrackingObj(),
  ),
};
export const CompleteStepFlowNavigator = createStackNavigator(
  CompleteStepFlowScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);
