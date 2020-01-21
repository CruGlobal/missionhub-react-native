import { createStackNavigator } from 'react-navigation-stack';

import { navigateToPostAuthScreen } from '../../actions/auth/auth';

import { authFlowGenerator } from './authFlowGenerator';

export const SignInFlowScreens = authFlowGenerator({
  completeAction: navigateToPostAuthScreen(),
  includeSignUp: false,
});

export const SignInFlowNavigator = createStackNavigator(SignInFlowScreens, {
  defaultNavigationOptions: {
    header: null,
  },
});
