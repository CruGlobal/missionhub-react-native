import { useSelector } from 'react-redux';

import { OnboardingState } from '../../reducers/onboarding';

export const useIsOnboarding = () =>
  useSelector<{ onboarding: OnboardingState }, boolean>(
    ({ onboarding }) => onboarding.currentlyOnboarding,
  );
