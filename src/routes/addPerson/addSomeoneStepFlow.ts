import { createStackNavigator } from 'react-navigation';

import { ADD_SOMEONE_SCREEN } from '../../containers/AddSomeoneScreen';
import { onboardingFlowGenerator } from '../onboarding/onboardingFlowGenerator';

export const AddSomeoneStepFlowScreens = onboardingFlowGenerator({
  startScreen: ADD_SOMEONE_SCREEN,
  hideSkipBtn: true,
});

export const AddSomeoneStepFlowNavigator = createStackNavigator(
  AddSomeoneStepFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
      gesturesEnabled: true,
    },
  },
);
