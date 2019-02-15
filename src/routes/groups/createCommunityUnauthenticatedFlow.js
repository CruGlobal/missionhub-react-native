import { createStackNavigator } from 'react-navigation';

import { navigateNestedReset, navigatePush } from '../../actions/navigation';
import { buildTrackedScreen, wrapNextAction, wrapProps } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import { MAIN_TABS } from '../../constants';
import {
  SIGN_UP_SCREEN,
  SIGNUP_TYPES,
} from '../../containers/Auth/SignUpScreen';
import SignUpScreen from '../../containers/Auth/SignUpScreen';
import { SIGN_IN_SCREEN } from '../../containers/Auth/SignInScreen';
import SignInScreen from '../../containers/Auth/SignInScreen';
import { MFA_CODE_SCREEN } from '../../containers/Auth/MFACodeScreen';
import MFACodeScreen from '../../containers/Auth/MFACodeScreen';
import { CREATE_GROUP_SCREEN } from '../../containers/Groups/CreateGroupScreen';

export const CreateCommunityUnauthenticatedFlowScreens = {
  [SIGN_UP_SCREEN]: buildTrackedScreen(
    wrapProps(
      wrapNextAction(
        SignUpScreen,
        ({ signIn } = {}) =>
          signIn
            ? navigatePush(SIGN_IN_SCREEN)
            : navigateNestedReset(MAIN_TABS, CREATE_GROUP_SCREEN),
      ),
      { signUpType: SIGNUP_TYPES.CREATE_COMMUNITY },
    ),
    buildTrackingObj('auth', 'auth'),
  ),
  [SIGN_IN_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      SignInScreen,
      ({ requires2FA, email, password } = {}) =>
        requires2FA
          ? navigatePush(MFA_CODE_SCREEN, { email, password })
          : navigateNestedReset(MAIN_TABS, CREATE_GROUP_SCREEN),
    ),
    buildTrackingObj('auth : sign in', 'auth'),
    { gesturesEnabled: true },
  ),
  [MFA_CODE_SCREEN]: buildTrackedScreen(
    wrapNextAction(MFACodeScreen, () => dispatch =>
      dispatch(navigateNestedReset(MAIN_TABS, CREATE_GROUP_SCREEN)),
    ),
    buildTrackingObj('auth : verification', 'auth'),
  ),
};

export const CreateCommunityUnauthenticatedFlowNavigator = createStackNavigator(
  CreateCommunityUnauthenticatedFlowScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);
