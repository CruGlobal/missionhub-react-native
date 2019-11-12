import { createStackNavigator } from 'react-navigation-stack';

import { onboardingFlowGenerator } from './onboardingFlowGenerator';

export const FullOnboardingFlowScreens = onboardingFlowGenerator({});

export const FullOnboardingFlowNavigator = createStackNavigator(
  FullOnboardingFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
      gesturesEnabled: true,
    },
  },
);
