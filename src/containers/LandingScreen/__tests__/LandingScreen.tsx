import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { startOnboarding } from '../../../actions/onboarding';
import {
  FULL_ONBOARDING_FLOW,
  JOIN_BY_CODE_ONBOARDING_FLOW,
  SIGN_IN_FLOW,
} from '../../../routes/constants';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import LandingScreen from '..';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/onboarding');
jest.mock('../../../actions/navigation');
jest.mock('../../../utils/hooks/useAnalytics');

const startOnboardingResult = { type: 'start onboarding' };
const navigatePushResult = { type: 'navigate push' };

beforeEach(() => {
  (startOnboarding as jest.Mock).mockReturnValue(startOnboardingResult);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
});

it('renders correctly', () => {
  renderWithContext(<LandingScreen />).snapshot();
});

it('tracks screen change on mount', () => {
  renderWithContext(<LandingScreen />);

  expect(useAnalytics).toHaveBeenCalledWith({ screenName: 'landing' });
});

describe('a button is clicked', () => {
  it('get started to be called', () => {
    const { store, getByTestId } = renderWithContext(<LandingScreen />);
    fireEvent.press(getByTestId('tryItNowButton'));

    expect(startOnboarding).toHaveBeenCalledWith();
    expect(navigatePush).toHaveBeenCalledWith(FULL_ONBOARDING_FLOW);
    expect(store.getActions()).toEqual([
      startOnboardingResult,
      navigatePushResult,
    ]);
  });

  it('community code to be called', () => {
    const { store, getByTestId } = renderWithContext(<LandingScreen />);
    fireEvent.press(getByTestId('communityCodeButton'));

    expect(startOnboarding).toHaveBeenCalledWith();
    expect(navigatePush).toHaveBeenCalledWith(JOIN_BY_CODE_ONBOARDING_FLOW);
    expect(store.getActions()).toEqual([
      startOnboardingResult,
      navigatePushResult,
    ]);
  });

  it('sign in button to be called', () => {
    const { store, getByTestId } = renderWithContext(<LandingScreen />);
    fireEvent.press(getByTestId('signInButton'));

    expect(navigatePush).toHaveBeenCalledWith(SIGN_IN_FLOW);
    expect(store.getActions()).toEqual([navigatePushResult]);
  });
});
