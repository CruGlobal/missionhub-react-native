import { navigatePush } from '../../actions/navigation';
import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import SignUpScreen, {
  SIGN_UP_SCREEN,
} from '../../containers/Auth/SignUpScreen';
import { SIGN_IN_SCREEN } from '../../containers/Auth/SignInScreen';
import SignInScreen from '../../containers/Auth/SignInScreen';
import { MFA_CODE_SCREEN } from '../../containers/Auth/MFACodeScreen';
import MFACodeScreen from '../../containers/Auth/MFACodeScreen';

export const authFlowGenerator = ({
  // @ts-ignore
  completeAction,
  includeSignUp = true,
  signUpType = null,
}) => ({
  ...(includeSignUp
    ? {
        [SIGN_UP_SCREEN]: buildTrackedScreen(
          wrapNextAction(
            SignUpScreen,
            ({ signIn } = {}) =>
              signIn ? navigatePush(SIGN_IN_SCREEN) : completeAction,
            { signUpType },
          ),
          // @ts-ignore
          buildTrackingObj('auth', 'auth'),
        ),
      }
    : {}),
  [SIGN_IN_SCREEN]: buildTrackedScreen(
    wrapNextAction(SignInScreen, ({ requires2FA, email, password } = {}) =>
      requires2FA
        ? navigatePush(MFA_CODE_SCREEN, { email, password })
        : completeAction,
    ),
    // @ts-ignore
    buildTrackingObj('auth : sign in', 'auth'),
    { gesturesEnabled: true },
  ),
  [MFA_CODE_SCREEN]: buildTrackedScreen(
    wrapNextAction(MFACodeScreen, () => completeAction),
    // @ts-ignore
    buildTrackingObj('auth : verification', 'auth'),
  ),
});
