import { createStackNavigator } from 'react-navigation';

import { navigatePush } from '../../actions/navigation';
import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import SignUpScreen, {
  SIGN_UP_SCREEN,
} from '../../containers/Auth/SignUpScreen';
import { navigateToPostAuthScreen } from '../../actions/auth/auth';
import { SIGN_IN_SCREEN } from '../../containers/Auth/SignInScreen';

import { SignInFlowScreens } from './signIn';

export const SignUpFlowScreens = {
  [SIGN_UP_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      SignUpScreen,
      ({ signIn } = {}) =>
        signIn ? navigatePush(SIGN_IN_SCREEN) : navigateToPostAuthScreen(),
    ),
    buildTrackingObj('auth', 'auth'),
  ),
  ...SignInFlowScreens,
};
export const SignUpFlowNavigator = createStackNavigator(SignUpFlowScreens, {
  navigationOptions: {
    header: null,
  },
});
