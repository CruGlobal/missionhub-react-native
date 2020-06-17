import { createStackNavigator } from 'react-navigation-stack';

import { onboardingFlowGenerator } from './onboardingFlowGenerator';

const FullOnboardingFlowScreens = onboardingFlowGenerator({});

export const FullOnboardingFlowNavigator = createStackNavigator(
  FullOnboardingFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
      gesturesEnabled: true,
    },
  },
);
