import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { logout } from '../../../actions/auth/auth';
import { navigateBack } from '../../../actions/navigation';
import { disableBack } from '../../../utils/common';
import { useLogoutOnBack } from '../../../utils/hooks/useLogoutOnBack';

import GetStartedScreen from '..';

jest.mock('react-native-device-info');
jest.mock('../../../actions/auth/auth');
jest.mock('../../../actions/navigation');
jest.mock('../../../utils/prompt');
jest.mock('../../../utils/common');
jest.mock('../../../utils/hooks/useLogoutOnBack');

const id = '1';

const initialState = {
  profile: {
    id,
    firstName: 'Roger',
  },
};
const next = jest.fn();
const back = jest.fn();
const nextResult = { type: 'next' };
const logoutResult = { type: 'logout' };
const navigateBackResult = { type: 'navigate back' };

beforeEach(() => {
  disableBack.add = jest.fn();
  disableBack.remove = jest.fn();
  next.mockReturnValue(nextResult);
  (logout as jest.Mock).mockReturnValue(logoutResult);
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
  (useLogoutOnBack as jest.Mock).mockReturnValue(back);
});

it('renders correctly', () => {
  renderWithContext(<GetStartedScreen next={next} />, {
    initialState,
    navParams: {},
  }).snapshot();
});

it('renders without back button correctly', () => {
  (useLogoutOnBack as jest.Mock).mockReturnValue(null);

  renderWithContext(<GetStartedScreen next={next} enableBackButton={false} />, {
    initialState,
    navParams: {},
  }).snapshot();
});

it('renders with back button correctly if logoutOnBack', () => {
  renderWithContext(<GetStartedScreen next={next} enableBackButton={false} />, {
    initialState,
    navParams: {
      logoutOnBack: true,
    },
  }).snapshot();
});

it('navigates to next screen', () => {
  const { getByTestId, store } = renderWithContext(
    <GetStartedScreen next={next} />,
    {
      initialState,
      navParams: {},
    },
  );

  fireEvent.press(getByTestId('bottomButton'));

  expect(next).toHaveBeenCalledWith({ id });
  expect(store.getActions()).toEqual([nextResult]);
});

describe('onBack prop', () => {
  describe('enableBackButton', () => {
    it('calls callback from useLogoutOnBack', () => {
      const { getByTestId } = renderWithContext(
        <GetStartedScreen next={next} />,
        {
          initialState,
          navParams: {},
        },
      );

      fireEvent.press(getByTestId('BackButton'));

      expect(useLogoutOnBack).toHaveBeenCalledWith(true, false);
      expect(back).toHaveBeenCalledWith();
    });
  });

  describe('logoutOnBack', () => {
    it('calls callback from useLogoutOnBack', async () => {
      const { getByTestId } = renderWithContext(
        <GetStartedScreen next={next} />,
        {
          initialState,
          navParams: { logoutOnBack: true },
        },
      );

      await fireEvent.press(getByTestId('BackButton'));

      expect(useLogoutOnBack).toHaveBeenCalledWith(true, true);
      expect(back).toHaveBeenCalledWith();
    });
  });
});
