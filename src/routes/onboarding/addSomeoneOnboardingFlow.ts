import { createStackNavigator } from 'react-navigation';

import { ADD_SOMEONE_SCREEN } from '../../containers/AddSomeoneScreen';

import { onboardingFlowGenerator } from './onboardingFlowGenerator';

export const AddSomeoneOnboardingFlowScreens = onboardingFlowGenerator({
  startScreen: ADD_SOMEONE_SCREEN,
  startScreenEnableBack: false,
});

export const AddSomeoneOnboardingFlowNavigator = createStackNavigator(
  AddSomeoneOnboardingFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
      gesturesEnabled: true,
    },
  },
);
