import { createStackNavigator } from 'react-navigation';

import { navigateToPostAuthScreen } from '../../actions/auth/auth';

import { authFlowGenerator } from './authFlowGenerator';

export const SignInFlowScreens = authFlowGenerator({
  completeAction: navigateToPostAuthScreen(),
  includeSignUp: false,
});

export const SignInFlowNavigator = createStackNavigator(SignInFlowScreens, {
  navigationOptions: {
    header: null,
  },
});
