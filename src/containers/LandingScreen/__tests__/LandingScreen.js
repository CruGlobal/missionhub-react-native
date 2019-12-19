import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import {
  FULL_ONBOARDING_FLOW,
  JOIN_BY_CODE_ONBOARDING_FLOW,
  SIGN_IN_FLOW,
} from '../../../routes/constants';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import LandingScreen from '..';

jest.mock('../../../actions/auth/userData');
jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn().mockReturnValue({ type: 'navigate push' }),
}));
jest.mock('../../../utils/hooks/useAnalytics');

it('renders correctly', () => {
  renderWithContext(<LandingScreen />).snapshot();
});

it('tracks screen change on mount', () => {
  renderWithContext(<LandingScreen />);

  expect(useAnalytics).toHaveBeenCalledWith('landing');
});

describe('a button is clicked', () => {
  it('get started to be called', () => {
    const { getByTestId } = renderWithContext(<LandingScreen />);
    fireEvent.press(getByTestId('tryItNowButton'));

    expect(navigatePush).toHaveBeenCalledWith(FULL_ONBOARDING_FLOW);
  });

  it('community code to be called', () => {
    const { getByTestId } = renderWithContext(<LandingScreen />);
    fireEvent.press(getByTestId('communityCodeButton'));

    expect(navigatePush).toHaveBeenCalledWith(JOIN_BY_CODE_ONBOARDING_FLOW);
  });

  it('sign in button to be called', () => {
    const { getByTestId } = renderWithContext(<LandingScreen />);
    fireEvent.press(getByTestId('signInButton'));

    expect(navigatePush).toHaveBeenCalledWith(SIGN_IN_FLOW);
  });
});
