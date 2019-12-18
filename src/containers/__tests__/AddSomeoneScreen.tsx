import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import AddSomeoneScreen from '../AddSomeoneScreen';
import { renderWithContext } from '../../../testUtils';
import { useLogoutOnBack } from '../../utils/hooks/useLogoutOnBack';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { skipOnboarding } from '../../actions/onboarding';

jest.mock('../../actions/onboarding');
jest.mock('../../utils/hooks/useLogoutOnBack');
jest.mock('../../utils/hooks/useAnalytics');

const next = jest.fn();
const back = jest.fn();
const nextResult = { type: 'next' };
const skipOnboardingResult = { type: 'skip onboarding' };

beforeEach(() => {
  (next as jest.Mock).mockReturnValue(nextResult);
  (skipOnboarding as jest.Mock).mockReturnValue(skipOnboardingResult);
  (useLogoutOnBack as jest.Mock).mockReturnValue(back);
  (useAnalytics as jest.Mock).mockClear();
});

it('renders correctly', () => {
  renderWithContext(<AddSomeoneScreen next={next} />).snapshot();
});

it('renders without skip button correctly', () => {
  renderWithContext(
    <AddSomeoneScreen next={next} hideSkipBtn={true} />,
  ).snapshot();
});

it('renders without back button correctly', () => {
  (useLogoutOnBack as jest.Mock).mockReturnValue(null);

  renderWithContext(
    <AddSomeoneScreen next={next} enableBackButton={false} />,
  ).snapshot();
});

it('tracks screen change on mount', () => {
  renderWithContext(<AddSomeoneScreen next={next} />);

  expect(useAnalytics).toHaveBeenCalledWith(['onboarding', 'add someone']);
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
  describe('enableBackButton', () => {
    it('calls callback from useLogoutOnBack', () => {
      const { getByTestId } = renderWithContext(
        <AddSomeoneScreen next={next} />,
      );

      fireEvent.press(getByTestId('BackButton'));

      expect(useLogoutOnBack).toHaveBeenCalledWith(true, false);
      expect(back).toHaveBeenCalledWith();
    });
  });

  describe('logoutOnBack', () => {
    it('calls callback from useLogoutOnBack', () => {
      const { getByTestId } = renderWithContext(
        <AddSomeoneScreen next={next} logoutOnBack={true} />,
      );

      fireEvent.press(getByTestId('BackButton'));

      expect(useLogoutOnBack).toHaveBeenCalledWith(true, true);
      expect(back).toHaveBeenCalledWith();
    });
  });
});
