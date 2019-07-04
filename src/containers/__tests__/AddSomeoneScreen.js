import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import AddSomeoneScreen from '../AddSomeoneScreen';
import { renderWithContext } from '../../../testUtils';
import { navigatePush, navigateBack } from '../../actions/navigation';
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
  navigateBack.mockReturnValue(navigateResult);
  next.mockReturnValue(nextResult);
  skipOnboarding.mockReturnValue(skipOnboardingResult);
});

it('renders correctly', () => {
  renderWithContext(<AddSomeoneScreen />).snapshot();
});

it('renders from null screen', () => {
  renderWithContext(<AddSomeoneScreen />, {
    navParams: { fromNullScreen: true },
  }).snapshot();
});

describe('onComplete', () => {
  it('calls next', () => {
    const { getByTestId, store } = renderWithContext(
      <AddSomeoneScreen next={next} />,
    );

    fireEvent.press(getByTestId('bottomButton'));

    expect(store.getActions()).toEqual([nextResult]);
    expect(next).toHaveBeenCalledWith({ skip: false });
  });

  it('navigates to SETUP_PERSON_SCREEN', () => {
    const { getByTestId, store } = renderWithContext(<AddSomeoneScreen />);

    fireEvent.press(getByTestId('bottomButton'));

    expect(store.getActions()).toEqual([navigateResult]);
    expect(navigatePush).toHaveBeenCalledWith(SETUP_PERSON_SCREEN);
  });
});

describe('onSkip prop', () => {
  it('calls next', () => {
    const { getByTestId, store } = renderWithContext(
      <AddSomeoneScreen next={next} />,
    );

    fireEvent.press(getByTestId('skipButton'));

    expect(store.getActions()).toEqual([nextResult]);
    expect(next).toHaveBeenCalledWith({ skip: true });
  });

  it('calls skipOnboarding', () => {
    const { getByTestId, store } = renderWithContext(<AddSomeoneScreen />);

    fireEvent.press(getByTestId('skipButton'));

    expect(store.getActions()).toEqual([skipOnboardingResult]);
    expect(skipOnboarding).toHaveBeenCalledWith();
  });
});

describe('onBack prop', () => {
  it('calls back', () => {
    const { getByTestId, store } = renderWithContext(<AddSomeoneScreen />, {
      navParams: { fromNullScreen: true },
    });

    fireEvent.press(getByTestId('BackButton'));

    expect(store.getActions()).toEqual([navigateResult]);
  });
});
