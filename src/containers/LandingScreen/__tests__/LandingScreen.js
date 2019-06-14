import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import LandingScreen from '..';

import { renderWithContext } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { WELCOME_SCREEN } from '../../WelcomeScreen';
import { firstTime } from '../../../actions/auth/userData';
import {
  JOIN_BY_CODE_ONBOARDING_FLOW,
  SIGN_IN_FLOW,
} from '../../../routes/constants';

jest.mock('../../../actions/auth/userData');
jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn().mockReturnValue({ type: 'navigate push' }),
}));

firstTime.mockReturnValue({ type: 'first time' });

it('renders correctly', () => {
  renderWithContext(<LandingScreen />).snapshot();
});

describe('a button is clicked', () => {
  it('get started to be called', () => {
    const { getByTestId } = renderWithContext(<LandingScreen />);
    fireEvent.press(getByTestId('tryItNowButton'));

    expect(firstTime).toHaveBeenCalled();
    expect(navigatePush).toHaveBeenCalledWith(WELCOME_SCREEN);
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
