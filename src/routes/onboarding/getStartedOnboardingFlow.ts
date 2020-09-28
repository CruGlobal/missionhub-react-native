import { createStackNavigator } from 'react-navigation-stack';

import { GET_STARTED_SCREEN } from '../../containers/GetStartedScreen/constants';

import { onboardingFlowGenerator } from './onboardingFlowGenerator';

// This is imported in a test using require
// eslint-disable-next-line import/no-unused-modules
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
