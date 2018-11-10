import { createStackNavigator } from 'react-navigation';

import { buildTrackingObj } from '../utils/common';
import LoginScreen, { LOGIN_SCREEN } from '../containers/LoginScreen';
import LoginOptionsScreen, {
  LOGIN_OPTIONS_SCREEN,
} from '../containers/LoginOptionsScreen';
import KeyLoginScreen, { KEY_LOGIN_SCREEN } from '../containers/KeyLoginScreen';
import MFACodeScreen, { MFA_CODE_SCREEN } from '../containers/MFACodeScreen';

export const AuthenticationScreens = {
  [LOGIN_SCREEN]: { screen: LoginScreen },
  [LOGIN_OPTIONS_SCREEN]: {
    screen: LoginOptionsScreen,
    tracking: buildTrackingObj(['auth']),
  },
  [KEY_LOGIN_SCREEN]: {
    screen: KeyLoginScreen,
    tracking: buildTrackingObj(['auth'], 'sign in'),
  },
  [MFA_CODE_SCREEN]: {
    screen: MFACodeScreen,
    tracking: buildTrackingObj(['auth'], 'verification'),
  },
};

export const AuthenticationNavigator = createStackNavigator(
  AuthenticationScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);
