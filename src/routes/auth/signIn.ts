import { createStackNavigator } from 'react-navigation-stack';

import { resetToInitialRoute } from '../../actions/navigationInit';

import { authFlowGenerator } from './authFlowGenerator';

const SignInFlowScreens = authFlowGenerator({
  completeAction: resetToInitialRoute(true),
  includeSignUp: false,
});

export const SignInFlowNavigator = createStackNavigator(SignInFlowScreens, {
  defaultNavigationOptions: {
    header: null,
  },
});
