import { createSwitchNavigator } from 'react-navigation';

import { MAIN_TABS } from '../constants';

import {
  AuthenticationNavigator,
  AuthenticationScreens,
} from './authentication';
import { OnboardingNavigator, OnboardingScreens } from './onboarding';
import { AUTHENTICATION_FLOW, ONBOARDING_FLOW } from './constants';
import { MainTabsNavigator } from './mainTabs';

export const trackableScreens = {
  [AUTHENTICATION_FLOW]: AuthenticationScreens,
  [ONBOARDING_FLOW]: OnboardingScreens,
  [MAIN_TABS]: 'something',
};

export const AppNavigator = createSwitchNavigator({
  [AUTHENTICATION_FLOW]: AuthenticationNavigator,
  [ONBOARDING_FLOW]: OnboardingNavigator,
  [MAIN_TABS]: MainTabsNavigator,
});
