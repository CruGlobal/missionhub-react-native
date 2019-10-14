import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { logout } from '../../../actions/auth/auth';
import { navigateBack } from '../../../actions/navigation';
import { prompt } from '../../../utils/prompt';
import { disableBack } from '../../../utils/common';

import GetStartedScreen from '..';

jest.mock('react-native-device-info');
jest.mock('../../../actions/auth/auth');
jest.mock('../../../actions/navigation');
jest.mock('../../../utils/prompt');
jest.mock('../../../utils/common');

const id = '1';

const initialState = {
  profile: {
    id,
    firstName: 'Roger',
  },
};
const next = jest.fn();
const nextResult = { type: 'next' };
const logoutResult = { type: 'logout' };
const navigateBackResult = { type: 'navigate back' };

beforeEach(() => {
  disableBack.add = jest.fn();
  disableBack.remove = jest.fn();
  next.mockReturnValue(nextResult);
  (logout as jest.Mock).mockReturnValue(logoutResult);
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
});

it('renders correctly', () => {
  renderWithContext(<GetStartedScreen next={next} />, {
    initialState,
    navParams: {},
  }).snapshot();
});

it('renders without back button correctly', () => {
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
    it('calls navigateBack', () => {
      const { getByTestId, store } = renderWithContext(
        <GetStartedScreen next={next} />,
        {
          initialState,
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
        <GetStartedScreen next={next} />,
        {
          initialState,
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
        <GetStartedScreen next={next} />,
        {
          initialState,
          navParams: { logoutOnBack: true },
        },
      );

      await fireEvent.press(getByTestId('BackButton'));

      expect(logout).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([]);
    });
  });
});
