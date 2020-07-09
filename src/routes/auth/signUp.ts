import { createStackNavigator } from 'react-navigation-stack';

import { resetToInitialRoute } from '../../actions/navigationInit';

import { authFlowGenerator } from './authFlowGenerator';

export const SignUpFlowScreens = authFlowGenerator({
  completeAction: resetToInitialRoute(true),
  includeSignUp: true,
});

export const SignUpFlowNavigator = createStackNavigator(SignUpFlowScreens, {
  defaultNavigationOptions: {
    header: null,
  },
});
