import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import AddSomeoneScreen from '../AddSomeoneScreen';
import { renderWithContext } from '../../../testUtils';
import { logout } from '../../actions/auth/auth';
import { navigateBack } from '../../actions/navigation';
import { skipOnboarding } from '../../actions/onboardingProfile';
import { prompt } from '../../utils/prompt';

jest.mock('../../actions/auth/auth');
jest.mock('../../actions/navigation');
jest.mock('../../actions/onboardingProfile');
jest.mock('../../utils/prompt');

const next = jest.fn();
const navigateBackResult = { type: 'navigate back' };
const logoutResult = { type: 'logout' };
const nextResult = { type: 'next' };
const skipOnboardingResult = { type: 'skip onboarding' };

beforeEach(() => {
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
  (logout as jest.Mock).mockReturnValue(logoutResult);
  (next as jest.Mock).mockReturnValue(nextResult);
  (skipOnboarding as jest.Mock).mockReturnValue(skipOnboardingResult);
});

it('renders correctly', () => {
  renderWithContext(<AddSomeoneScreen next={next} />, {
    navParams: {},
  }).snapshot();
});

it('renders without skip button correctly', () => {
  renderWithContext(<AddSomeoneScreen next={next} hideSkipBtn={true} />, {
    navParams: {},
  }).snapshot();
});

it('renders without back button correctly', () => {
  renderWithContext(<AddSomeoneScreen next={next} enableBackButton={false} />, {
    navParams: {},
  }).snapshot();
});

it('renders with back button correctly if logoutOnBack', () => {
  renderWithContext(<AddSomeoneScreen next={next} enableBackButton={false} />, {
    navParams: { logoutOnBack: true },
  }).snapshot();
});

describe('onComplete', () => {
  it('calls next', () => {
    const { getByTestId, store } = renderWithContext(
      <AddSomeoneScreen next={next} />,
      {
        navParams: {},
      },
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
      {
        navParams: {},
      },
    );

    fireEvent.press(getByTestId('skipButton'));

    expect(store.getActions()).toEqual([nextResult]);
    expect(next).toHaveBeenCalledWith({ skip: true });
  });
});

describe('onBack prop', () => {
  describe('enableBackButton', () => {
    it('calls navigateBack', () => {
      const { getByTestId, store } = renderWithContext(
        <AddSomeoneScreen next={next} />,
        {
          navParams: {},
        },
      );

      fireEvent.press(getByTestId('BackButton'));

      expect(navigateBack).toHaveBeenCalledWith();
      expect(store.getActions()).toEqual([navigateBackResult]);
    });
  });

  describe('logoutOnBack', () => {
    it('calls logout', async () => {
      (prompt as jest.Mock).mockReturnValue(Promise.resolve(true));

      const { getByTestId, store } = renderWithContext(
        <AddSomeoneScreen next={next} />,
        {
          navParams: { logoutOnBack: true },
        },
      );

      await fireEvent.press(getByTestId('BackButton'));

      expect(logout).toHaveBeenCalledWith();
      expect(store.getActions()).toEqual([logoutResult]);
    });

    it('does not call logout', async () => {
      (prompt as jest.Mock).mockReturnValue(Promise.resolve(false));

      const { getByTestId, store } = renderWithContext(
        <AddSomeoneScreen next={next} />,
        {
          navParams: { logoutOnBack: true },
        },
      );

      await fireEvent.press(getByTestId('BackButton'));

      expect(logout).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([]);
    });
  });
});
