import 'react-native';
import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { useLogoutOnBack } from '../../../utils/hooks/useLogoutOnBack';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import GetStartedScreen from '..';

jest.mock('react-native-device-info');
jest.mock('../../../utils/hooks/useLogoutOnBack');
jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../auth/authStore', () => ({ isAuthenticated: () => true }));

const initialState = {
  onboarding: { currentlyOnboarding: true },
};
const next = jest.fn();
const back = jest.fn();
const nextResult = { type: 'next' };

beforeEach(() => {
  next.mockReturnValue(nextResult);
  (useLogoutOnBack as jest.Mock).mockReturnValue(back);
});

it('renders correctly', async () => {
  const { snapshot } = renderWithContext(<GetStartedScreen next={next} />, {
    initialState,
  });

  await flushMicrotasksQueue();

  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith([
    'onboarding',
    'personal greeting',
  ]);
});

it('renders without back button correctly', async () => {
  (useLogoutOnBack as jest.Mock).mockReturnValue(null);

  const { snapshot } = renderWithContext(
    <GetStartedScreen next={next} enableBackButton={false} />,
    {
      initialState,
    },
  );

  await flushMicrotasksQueue();

  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith([
    'onboarding',
    'personal greeting',
  ]);
});

it('navigates to next screen', () => {
  const { getByTestId, store } = renderWithContext(
    <GetStartedScreen next={next} />,
    {
      initialState,
    },
  );

  fireEvent.press(getByTestId('bottomButton'));

  expect(next).toHaveBeenCalledWith();
  expect(store.getActions()).toEqual([nextResult]);
});

describe('onBack prop', () => {
  describe('enableBackButton', () => {
    it('calls callback from useLogoutOnBack', () => {
      const { getByTestId } = renderWithContext(
        <GetStartedScreen next={next} />,
        {
          initialState,
        },
      );

      fireEvent.press(getByTestId('DeprecatedBackButton'));

      expect(useLogoutOnBack).toHaveBeenCalledWith(true, false);
      expect(back).toHaveBeenCalledWith();
    });
  });

  describe('logoutOnBack', () => {
    it('calls callback from useLogoutOnBack', () => {
      const { getByTestId } = renderWithContext(
        <GetStartedScreen next={next} logoutOnBack={true} />,
        {
          initialState,
        },
      );

      fireEvent.press(getByTestId('DeprecatedBackButton'));

      expect(useLogoutOnBack).toHaveBeenCalledWith(true, true);
      expect(back).toHaveBeenCalledWith();
    });
  });
});
