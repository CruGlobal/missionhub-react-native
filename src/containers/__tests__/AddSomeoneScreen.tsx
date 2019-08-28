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
  (navigateBack as jest.Mock).mockReturnValue(navigateResult);
  (next as jest.Mock).mockReturnValue(nextResult);
  (skipOnboarding as jest.Mock).mockReturnValue(skipOnboardingResult);
});

it('renders correctly', () => {
  renderWithContext(<AddSomeoneScreen next={next} />).snapshot();
});

it('renders from null screen', () => {
  renderWithContext(
    <AddSomeoneScreen next={next} hideSkipBtn={true} />,
  ).snapshot();
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
});

describe('onBack prop', () => {
  it('calls back', () => {
    const { getByTestId, store } = renderWithContext(
      <AddSomeoneScreen next={next} hideSkipBtn={true} />,
    );

    fireEvent.press(getByTestId('BackButton'));

    expect(store.getActions()).toEqual([navigateResult]);
  });
});
