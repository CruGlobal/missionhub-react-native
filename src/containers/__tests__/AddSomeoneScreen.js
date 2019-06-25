import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import AddSomeoneScreen from '../AddSomeoneScreen';
import { renderWithContext } from '../../../testUtils';
import { navigatePush } from '../../actions/navigation';
import { SETUP_PERSON_SCREEN } from '../SetupPersonScreen';
import { skipOnboarding } from '../../actions/onboardingProfile';

jest.mock('../../actions/navigation');
jest.mock('../../actions/onboardingProfile');

const next = jest.fn();
const navigateResult = { type: 'navigated' };
const nextResult = { type: 'next' };
const skipOnboardingResult = { type: 'skip onboarding' };

beforeEach(() => {
  navigatePush.mockReturnValue(navigateResult);
  next.mockReturnValue(nextResult);
  skipOnboarding.mockReturnValue(skipOnboardingResult);
});

it('renders correctly', () => {
  renderWithContext(<AddSomeoneScreen />).snapshot();
});

describe('onComplete', () => {
  it('calls next', () => {
    const { getByTestId, store } = renderWithContext(
      <AddSomeoneScreen next={next} />,
    );

    fireEvent.press(getByTestId('BottomButton'));

    expect(store.getActions()).toEqual([nextResult]);
    expect(next).toHaveBeenCalledWith({ skip: false });
  });

  it('navigates to SETUP_PERSON_SCREEN', () => {
    const { getByTestId, store } = renderWithContext(<AddSomeoneScreen />);

    fireEvent.press(getByTestId('BottomButton'));

    expect(store.getActions()).toEqual([navigateResult]);
    expect(navigatePush).toHaveBeenCalledWith(SETUP_PERSON_SCREEN);
  });
});

describe('onSkip prop', () => {
  it('calls next', () => {
    const { getByTestId, store } = renderWithContext(
      <AddSomeoneScreen next={next} />,
    );

    fireEvent.press(getByTestId('SkipButton'));

    expect(store.getActions()).toEqual([nextResult]);
    expect(next).toHaveBeenCalledWith({ skip: true });
  });

  it('calls skipOnboarding', () => {
    const { getByTestId, store } = renderWithContext(<AddSomeoneScreen />);

    fireEvent.press(getByTestId('SkipButton'));

    expect(store.getActions()).toEqual([skipOnboardingResult]);
    expect(skipOnboarding).toHaveBeenCalledWith();
  });
});
