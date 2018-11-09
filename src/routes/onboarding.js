import React from 'react';
import { createStackNavigator } from 'react-navigation';

import { buildTrackingObj } from '../utils/common';
import { navigatePush } from '../actions/navigation';
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
import SetupPersonScreen, {
  SETUP_PERSON_SCREEN,
} from '../containers/SetupPersonScreen';
import NotificationPrimerScreen, {
  NOTIFICATION_PRIMER_SCREEN,
} from '../containers/NotificationPrimerScreen';
import NotificationOffScreen, {
  NOTIFICATION_OFF_SCREEN,
} from '../containers/NotificationOffScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../containers/CelebrationScreen';

export const ONBOARDING_FLOW = 'nav/ONBOARDING_FLOW';

const wrapNextScreen = (WrappedComponent, nextScreen, extraProps = {}) =>
  wrapNextScreenFn(WrappedComponent, () => nextScreen, extraProps);

const wrapNextScreenFn = (WrappedComponent, fn, extraProps = {}) =>
  wrapNextAction(
    WrappedComponent,
    props => navigatePush(fn(props), props),
    extraProps,
  );

const wrapNextAction = (WrappedComponent, nextAction, extraProps = {}) =>
  wrapProps(WrappedComponent, {
    ...extraProps,
    next: nextAction,
  });

const wrapProps = (WrappedComponent, extraProps = {}) => props => (
  <WrappedComponent {...props} {...extraProps} />
);

export const OnboardingScreens = {
  [WELCOME_SCREEN]: {
    screen: wrapNextScreen(WelcomeScreen, SETUP_SCREEN),
    tracking: buildTrackingObj('onboarding : welcome', 'onboarding'),
  },
  [SETUP_SCREEN]: {
    screen: wrapNextScreen(SetupScreen, GET_STARTED_SCREEN),
    tracking: buildTrackingObj('onboarding : name', 'onboarding'),
  },
  [GET_STARTED_SCREEN]: {
    screen: wrapNextScreen(GetStartedScreen, STAGE_SCREEN),
    tracking: buildTrackingObj('onboarding : get started', 'onboarding'),
  },
  [STAGE_SCREEN]: {
    screen: wrapNextScreenFn(
      StageScreen,
      ({ isMe }) => (isMe ? STAGE_SUCCESS_SCREEN : SELECT_STEP_SCREEN),
      {
        trackAsOnboarding: true,
      },
    ),
    tracking: buildTrackingObj(
      'onboarding : self : choose my stage',
      'onboarding',
      'self',
    ),
  },
  [STAGE_SUCCESS_SCREEN]: {
    screen: wrapNextScreen(StageSuccessScreen, SELECT_STEP_SCREEN),
    tracking: buildTrackingObj(
      'onboarding : self : choose my steps',
      'onboarding',
      'self',
    ),
  },
  [SELECT_STEP_SCREEN]: {
    screen: wrapNextScreenFn(
      SelectStepScreen,
      ({ isMe }) => (isMe ? ADD_SOMEONE_SCREEN : NOTIFICATION_PRIMER_SCREEN),
      {
        trackAsOnboarding: true,
      },
    ),
    tracking: buildTrackingObj(
      'onboarding : self : steps : add',
      'onboarding',
      'self',
      'steps',
    ),
  },
  [ADD_STEP_SCREEN]: { screen: AddStepScreen },
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

export const OnboardingNavigator = createStackNavigator(OnboardingScreens, {
  initialRouteName: WELCOME_SCREEN,
  navigationOptions: {
    header: null,
  },
});
