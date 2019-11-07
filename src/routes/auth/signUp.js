import { createStackNavigator } from 'react-navigation-stack';

import { navigateToPostAuthScreen } from '../../actions/auth/auth';

import { authFlowGenerator } from './authFlowGenerator';

export const SignUpFlowScreens = authFlowGenerator({
  completeAction: navigateToPostAuthScreen(),
  includeSignUp: true,
});

export const SignUpFlowNavigator = createStackNavigator(SignUpFlowScreens, {
  defaultNavigationOptions: {
    header: null,
  },
});
