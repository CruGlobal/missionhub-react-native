import React from 'react';
import { createStackNavigator } from 'react-navigation';

import { WELCOME_SCREEN } from '../containers/WelcomeScreen';
import WelcomeScreen from '../containers/WelcomeScreen';
import { buildTrackingObj } from '../utils/common';
import { SETUP_SCREEN } from '../containers/SetupScreen';
import SetupScreen from '../containers/SetupScreen';
import { GET_STARTED_SCREEN } from '../containers/GetStartedScreen';
import GetStartedScreen from '../containers/GetStartedScreen';
import { STAGE_SUCCESS_SCREEN } from '../containers/StageSuccessScreen';
import StageSuccessScreen from '../containers/StageSuccessScreen';
import { SELECT_MY_STEP_SCREEN } from '../containers/SelectMyStepScreen';
import SelectMyStepScreen from '../containers/SelectMyStepScreen';
import { ADD_SOMEONE_SCREEN } from '../containers/AddSomeoneScreen';
import AddSomeoneScreen from '../containers/AddSomeoneScreen';
import { SETUP_PERSON_SCREEN } from '../containers/SetupPersonScreen';
import SetupPersonScreen from '../containers/SetupPersonScreen';
import { NOTIFICATION_PRIMER_SCREEN } from '../containers/NotificationPrimerScreen';
import NotificationPrimerScreen from '../containers/NotificationPrimerScreen';
import { NOTIFICATION_OFF_SCREEN } from '../containers/NotificationOffScreen';
import NotificationOffScreen from '../containers/NotificationOffScreen';
import { STAGE_SCREEN } from '../containers/StageScreen';
import StageScreen from '../containers/StageScreen';
import { PERSON_STAGE_SCREEN } from '../containers/PersonStageScreen';
import PersonStageScreen from '../containers/PersonStageScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../containers/PersonSelectStepScreen';
import PersonSelectStepScreen from '../containers/PersonSelectStepScreen';
import { CELEBRATION_SCREEN } from '../containers/CelebrationScreen';
import CelebrationScreen from '../containers/CelebrationScreen';
import { navigatePush } from '../actions/navigation';

export const ONBOARDING_FLOW = 'nav/ONBOARDING_FLOW';

const nextActionCreator = action => nextScreen => props =>
  action(nextScreen, props);

const navigateToScreen = nextActionCreator(navigatePush);

const wrapNext = (
  WrappedComponent,
  nextScreen,
  extraProps = {},
  customAction = navigateToScreen,
) => props => <WrappedComponent {...props} next={customAction(nextScreen)} />;

export const OnboardingScreens = {
  [WELCOME_SCREEN]: {
    screen: wrapNext(WelcomeScreen, SETUP_SCREEN),
    tracking: buildTrackingObj('onboarding : welcome', 'onboarding'),
  },
  [SETUP_SCREEN]: {
    screen: wrapNext(SetupScreen, GET_STARTED_SCREEN),
    tracking: buildTrackingObj('onboarding : name', 'onboarding'),
  },
  [GET_STARTED_SCREEN]: {
    screen: wrapNext(GetStartedScreen, STAGE_SCREEN),
    tracking: buildTrackingObj('onboarding : get started', 'onboarding'),
  },
  [STAGE_SCREEN]: {
    screen: wrapNext(StageScreen, STAGE_SUCCESS_SCREEN, {
      trackAsOnboarding: true,
    }),
    tracking: buildTrackingObj(
      'onboarding : self : choose my stage',
      'onboarding',
      'self',
    ),
  },
  [STAGE_SUCCESS_SCREEN]: {
    screen: StageSuccessScreen,
    tracking: buildTrackingObj(
      'onboarding : self : choose my steps',
      'onboarding',
      'self',
    ),
  },
  [SELECT_MY_STEP_SCREEN]: {
    screen: SelectMyStepScreen,
    tracking: buildTrackingObj(
      'onboarding : self : steps : add',
      'onboarding',
      'self',
      'steps',
    ),
  },
  [ADD_SOMEONE_SCREEN]: {
    screen: AddSomeoneScreen,
    tracking: buildTrackingObj(
      'onboarding : add person',
      'onboarding',
      'add person',
    ),
  },
  [SETUP_PERSON_SCREEN]: {
    screen: SetupPersonScreen,
    tracking: buildTrackingObj(
      'onboarding : add person : name',
      'onboarding',
      'add person',
    ),
  },
  [PERSON_STAGE_SCREEN]: {
    screen: PersonStageScreen,
  },
  [PERSON_SELECT_STEP_SCREEN]: {
    screen: PersonSelectStepScreen,
  },
  [NOTIFICATION_PRIMER_SCREEN]: {
    screen: NotificationPrimerScreen,
    tracking: buildTrackingObj(
      'menu : notifications : permissions',
      'menu',
      'notifications',
    ),
  },
  [NOTIFICATION_OFF_SCREEN]: {
    screen: NotificationOffScreen,
    tracking: buildTrackingObj(
      'menu : notifications : off',
      'menu',
      'notifications',
    ),
  },
  [CELEBRATION_SCREEN]: { screen: CelebrationScreen },
};

const OnboardingStackNavigator = createStackNavigator(OnboardingScreens, {
  initialRouteName: WELCOME_SCREEN,
  navigationOptions: {
    header: null,
  },
});

export class OnboardingNavigator extends React.Component {
  static router = {
    ...OnboardingStackNavigator.router,
    getStateForAction: (action, lastState) => {
      // check for custom actions and return a different navigation state.
      return OnboardingStackNavigator.router.getStateForAction(
        action,
        lastState,
      );
    },
  };
  render() {
    const { navigation } = this.props;

    return <OnboardingStackNavigator navigation={navigation} />;
  }
}
