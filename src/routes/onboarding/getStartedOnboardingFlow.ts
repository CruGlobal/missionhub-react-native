import { createStackNavigator } from 'react-navigation';

import { buildTrackedScreen, wrapNextAction, wrapNextScreen } from '../helpers';
import { navigatePush } from '../../actions/navigation';
import { buildTrackingObj } from '../../utils/common';
import WelcomeScreen, { WELCOME_SCREEN } from '../../containers/WelcomeScreen';
import SetupScreen, { SETUP_SCREEN } from '../../containers/SetupScreen';
import GetStartedScreen, {
  GET_STARTED_SCREEN,
} from '../../containers/GetStartedScreen';
import StageScreen, { STAGE_SCREEN } from '../../containers/StageScreen';
import StageSuccessScreen, {
  STAGE_SUCCESS_SCREEN,
} from '../../containers/StageSuccessScreen';
import SelectMyStepScreen, {
  SELECT_MY_STEP_ONBOARDING_SCREEN,
} from '../../containers/SelectMyStepScreen';
import AddSomeoneScreen, {
  ADD_SOMEONE_SCREEN,
} from '../../containers/AddSomeoneScreen';
import SetupPersonScreen, {
  SETUP_PERSON_SCREEN,
} from '../../containers/SetupPersonScreen';
import PersonStageScreen, {
  PERSON_STAGE_SCREEN,
} from '../../containers/PersonStageScreen';
import PersonSelectStepScreen, {
  PERSON_SELECT_STEP_SCREEN,
} from '../../containers/PersonSelectStepScreen';
import NotificationPrimerScreen, {
  NOTIFICATION_PRIMER_SCREEN,
} from '../../containers/NotificationPrimerScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../containers/CelebrationScreen';

export const GetStartedOnboardingFlowScreens = {
  [WELCOME_SCREEN]: buildTrackedScreen(
    wrapNextScreen(WelcomeScreen, SETUP_SCREEN),
    buildTrackingObj('onboarding : welcome', 'onboarding'),
  ),
  [SETUP_SCREEN]: buildTrackedScreen(
    wrapNextScreen(SetupScreen, GET_STARTED_SCREEN),
    buildTrackingObj('onboarding : name', 'onboarding'),
  ),
  [GET_STARTED_SCREEN]: buildTrackedScreen(
    wrapNextAction(GetStartedScreen, () => dispatch => {
      dispatch(
        navigatePush(STAGE_SCREEN, {
          section: 'onboarding',
          subsection: 'self',
          enableBackButton: false,
        }),
      );
    }),
    buildTrackingObj('onboarding : get started', 'onboarding'),
  ),
  [STAGE_SCREEN]: buildTrackedScreen(
    wrapNextScreen(StageScreen, STAGE_SUCCESS_SCREEN),
    buildTrackingObj('onboarding : name', 'onboarding'),
  ),
  [STAGE_SUCCESS_SCREEN]: buildTrackedScreen(
    wrapNextAction(StageSuccessScreen, ({ stage }) => dispatch => {
      dispatch(
        navigatePush(SELECT_MY_STEP_ONBOARDING_SCREEN, {
          onboarding: true,
          stage,
          enableBackButton: false,
        }),
      );
    }),
    buildTrackingObj(
      'onboarding : self : choose my steps',
      'onboarding',
      'self',
    ),
  ),
  [SELECT_MY_STEP_ONBOARDING_SCREEN]: buildTrackedScreen(
    wrapNextScreen(SelectMyStepScreen, ADD_SOMEONE_SCREEN),
    buildTrackingObj('onboarding : name', 'onboarding'),
  ),
  [ADD_SOMEONE_SCREEN]: buildTrackedScreen(
    wrapNextScreen(AddSomeoneScreen, SETUP_PERSON_SCREEN),
    buildTrackingObj('onboarding : add person', 'onboarding', 'add person'),
  ),
  [SETUP_PERSON_SCREEN]: buildTrackedScreen(
    wrapNextAction(SetupPersonScreen, () => async dispatch => {}),
    buildTrackingObj('onboarding : name', 'onboarding'),
  ),
  [PERSON_STAGE_SCREEN]: buildTrackedScreen(
    wrapNextAction(PersonStageScreen, () => async dispatch => {}),
    buildTrackingObj('onboarding : name', 'onboarding'),
  ),
  [PERSON_SELECT_STEP_SCREEN]: buildTrackedScreen(
    wrapNextAction(PersonSelectStepScreen, () => async dispatch => {}),
    buildTrackingObj('onboarding : name', 'onboarding'),
  ),
};
export const GetStartedOnboardingFlowNavigator = createStackNavigator(
  GetStartedOnboardingFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
      gesturesEnabled: true,
    },
  },
);
