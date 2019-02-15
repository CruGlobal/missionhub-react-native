import { createStackNavigator } from 'react-navigation';

import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import SignInScreen, {
  SIGN_IN_SCREEN,
} from '../../containers/Auth/SignInScreen';
import MFACodeScreen, {
  MFA_CODE_SCREEN,
} from '../../containers/Auth/MFACodeScreen';
import { navigatePush } from '../../actions/navigation';
import { navigateToPostAuthScreen } from '../../actions/auth/auth';

export const SignInFlowScreens = {
  [SIGN_IN_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      SignInScreen,
      ({ requires2FA, email, password } = {}) =>
        requires2FA
          ? navigatePush(MFA_CODE_SCREEN, { email, password })
          : navigateToPostAuthScreen(),
    ),
    buildTrackingObj('auth : sign in', 'auth'),
    { gesturesEnabled: true },
  ),
  [MFA_CODE_SCREEN]: buildTrackedScreen(
    wrapNextAction(MFACodeScreen, () => navigateToPostAuthScreen()),
    buildTrackingObj('auth : verification', 'auth'),
  ),
};
export const SignInFlowNavigator = createStackNavigator(SignInFlowScreens, {
  navigationOptions: {
    header: null,
  },
});
