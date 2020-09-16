import { createStackNavigator } from 'react-navigation-stack';

import { GET_STARTED_SCREEN } from '../../containers/GetStartedScreen/constants';

import { onboardingFlowGenerator } from './onboardingFlowGenerator';

export const GetStartedOnboardingFlowScreens = onboardingFlowGenerator({
  startScreen: GET_STARTED_SCREEN,
});

export const GetStartedOnboardingFlowNavigator = createStackNavigator(
  GetStartedOnboardingFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
      gesturesEnabled: true,
    },
  },
);
