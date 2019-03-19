import { createStackNavigator, StackActions } from 'react-navigation';

import { updatePersonAttributes } from '../../actions/person';
import { reloadJourney } from '../../actions/journey';
import { navigatePush } from '../../actions/navigation';
import { firstTime, loadHome } from '../../actions/auth';
import {
  completeOnboarding,
  stashCommunityToJoin,
  joinStashedCommunity,
  showNotificationPrompt,
  landOnStashedCommunityScreen,
} from '../../actions/onboardingProfile';
import { buildTrackedScreen, wrapNextAction, wrapNextScreen } from '../helpers';
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
  SELECT_MY_STEP_SCREEN,
} from '../../containers/SelectMyStepScreen';
import SuggestedStepDetailScreen, {
  SUGGESTED_STEP_DETAIL_SCREEN,
} from '../../containers/SuggestedStepDetailScreen';
import AddStepScreen, { ADD_STEP_SCREEN } from '../../containers/AddStepScreen';
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

export const TryItNowOnboardingFlowScreens = {
  [WELCOME_SCREEN]: buildTrackedScreen(
    wrapNextScreen(WelcomeScreen, SETUP_SCREEN),
    buildTrackingObj('onboarding : welcome', 'onboarding'),
  ),
  [SETUP_SCREEN]: buildTrackedScreen(
    wrapNextScreen(SetupScreen, GET_STARTED_SCREEN),
    buildTrackingObj('onboarding : name', 'onboarding'),
  ),
  [GET_STARTED_SCREEN]: buildTrackedScreen(
    wrapNextScreen(GetStartedScreen, STAGE_SCREEN),
    buildTrackingObj('onboarding : get started', 'onboarding'),
  ),
  [STAGE_SCREEN]: wrapNextAction(
    StageScreen,
    ({ stage, contactId, orgId, isAlreadySelected }) => dispatch => {
      console.log(stage);
      dispatch(
        updatePersonAttributes(contactId, {
          user: { pathway_stage_id: stage.id },
        }),
      );

      dispatch(navigatePush(STAGE_SUCCESS_SCREEN, { selectedStage: stage }));
    },
  ),
  [STAGE_SUCCESS_SCREEN]: buildTrackedScreen(
    wrapNextScreen(StageSuccessScreen, SELECT_MY_STEP_SCREEN),
    buildTrackingObj(
      'onboarding : self : choose my steps',
      'onboarding',
      'self',
    ),
  ),
  [SELECT_MY_STEP_SCREEN]: buildTrackedScreen(
    wrapNextScreen(SelectMyStepScreen, ADD_SOMEONE_SCREEN),
    buildTrackingObj(
      'onboarding : self : steps : add',
      'onboarding',
      'self',
      'steps',
    ),
  ),
  [SUGGESTED_STEP_DETAIL_SCREEN]: {
    screen: wrapNextScreen(AddStepScreen, ADD_SOMEONE_SCREEN),
  },
  [ADD_STEP_SCREEN]: {
    screen: wrapNextScreen(AddStepScreen, ADD_SOMEONE_SCREEN),
  },
  [ADD_SOMEONE_SCREEN]: buildTrackedScreen(
    wrapNextScreen(AddSomeoneScreen, SETUP_PERSON_SCREEN),
    buildTrackingObj('onboarding : add person', 'onboarding', 'add person'),
  ),
  [SETUP_PERSON_SCREEN]: buildTrackedScreen(
    wrapNextScreen(SetupPersonScreen, PERSON_STAGE_SCREEN),
    buildTrackingObj(
      'onboarding : add person : name',
      'onboarding',
      'add person',
    ),
  ),
  [PERSON_STAGE_SCREEN]: {
    screen: wrapNextScreen(PersonStageScreen, PERSON_SELECT_STEP_SCREEN),
    navigationOptions: { gesturesEnabled: true },
  },
  [PERSON_SELECT_STEP_SCREEN]: {
    screen: wrapNextScreen(PersonSelectStepScreen, NOTIFICATION_PRIMER_SCREEN),
    navigationOptions: { gesturesEnabled: true },
  },
  [NOTIFICATION_PRIMER_SCREEN]: buildTrackedScreen(
    wrapNextScreen(NotificationPrimerScreen, CELEBRATION_SCREEN),
    buildTrackingObj(
      'menu : notifications : permissions',
      'menu',
      'notifications',
    ),
  ),
  [CELEBRATION_SCREEN]: wrapNextAction(
    CelebrationScreen,
    ({ contactId, orgId }) => dispatch => {
      dispatch(reloadJourney(contactId, orgId));
      dispatch(StackActions.popToTop());

      dispatch(StackActions.pop({ immediate: true }));
    },
  ),
};
export const TryItNowOnboardingFlowNavigator = createStackNavigator(
  TryItNowOnboardingFlowScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);
