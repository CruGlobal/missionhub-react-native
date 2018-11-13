import { createStackNavigator } from 'react-navigation';

import { buildTrackingObj } from '../utils/common';
import { navigate } from '../actions/navigation';
import WelcomeScreen, { WELCOME_SCREEN } from '../containers/WelcomeScreen';
import SetupScreen, { SETUP_SCREEN } from '../containers/SetupScreen';
import GetStartedScreen, {
  GET_STARTED_SCREEN,
} from '../containers/GetStartedScreen';
import StageScreen, { STAGE_SCREEN } from '../containers/StageScreen';
import StageSuccessScreen, {
  STAGE_SUCCESS_SCREEN,
} from '../containers/StageSuccessScreen';
import SelectStepScreen, {
  SELECT_STEP_SCREEN,
} from '../containers/SelectStepScreen';
import AddStepScreen, { ADD_STEP_SCREEN } from '../containers/AddStepScreen';
import AddSomeoneScreen, {
  ADD_SOMEONE_SCREEN,
} from '../containers/AddSomeoneScreen';
import NotificationPrimerScreen, {
  NOTIFICATION_PRIMER_SCREEN,
} from '../containers/NotificationPrimerScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../containers/CelebrationScreen';
import { MAIN_TABS } from '../constants';

import { wrapNextAction, wrapNextScreen, wrapNextScreenFn } from './helpers';

export const OnboardingScreens = {
  [WELCOME_SCREEN]: {
    screen: wrapNextScreen(WelcomeScreen, SETUP_SCREEN),
    tracking: buildTrackingObj(['onboarding'], 'welcome'),
  },
  [SETUP_SCREEN]: {
    screen: wrapNextScreenFn(
      SetupScreen,
      ({ isMe }) => (isMe ? GET_STARTED_SCREEN : STAGE_SCREEN),
    ),
    tracking: buildTrackingObj(['onboarding'], 'name'),
  },
  [GET_STARTED_SCREEN]: {
    screen: wrapNextScreen(GetStartedScreen, STAGE_SCREEN),
    tracking: buildTrackingObj(['onboarding'], 'get started'),
  },
  [STAGE_SCREEN]: {
    screen: wrapNextScreenFn(
      StageScreen,
      ({ isMe }) => (isMe ? STAGE_SUCCESS_SCREEN : SELECT_STEP_SCREEN),
      {
        trackAsOnboarding: true,
      },
    ),
    tracking: buildTrackingObj(['onboarding'], 'choose stage'),
  },
  [STAGE_SUCCESS_SCREEN]: {
    screen: wrapNextScreen(StageSuccessScreen, SELECT_STEP_SCREEN),
    tracking: buildTrackingObj(['onboarding', 'self'], 'chose stage'),
  },
  [SELECT_STEP_SCREEN]: {
    screen: wrapNextScreenFn(
      SelectStepScreen,
      ({ isMe }) => (isMe ? ADD_SOMEONE_SCREEN : NOTIFICATION_PRIMER_SCREEN),
      {
        trackAsOnboarding: true,
      },
    ),
    tracking: buildTrackingObj(['onboarding', 'steps'], 'add'),
  },
  [ADD_STEP_SCREEN]: { screen: AddStepScreen },
  [ADD_SOMEONE_SCREEN]: {
    screen: wrapNextScreen(AddSomeoneScreen, SETUP_SCREEN),
    tracking: buildTrackingObj(['onboarding'], 'add person'),
  },
  [NOTIFICATION_PRIMER_SCREEN]: {
    screen: wrapNextScreen(NotificationPrimerScreen, CELEBRATION_SCREEN),
    tracking: buildTrackingObj(['menu', 'notifications'], 'permissions'),
  },
  [CELEBRATION_SCREEN]: {
    screen: wrapNextAction(CelebrationScreen, () => dispatch =>
      dispatch(navigate(MAIN_TABS)),
    ),
    navigationOptions: { gesturesEnabled: false },
  },
};

export const OnboardingNavigator = createStackNavigator(OnboardingScreens, {
  navigationOptions: {
    header: null,
  },
});
