import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { disableBack } from '../../../utils/common';
import { useLogoutOnBack } from '../../../utils/hooks/useLogoutOnBack';

import GetStartedScreen from '..';

jest.mock('react-native-device-info');
jest.mock('../../../utils/common');
jest.mock('../../../utils/hooks/useLogoutOnBack');

const initialState = {
  auth: { person: { first_name: 'Roger' } },
};
const next = jest.fn();
const back = jest.fn();
const nextResult = { type: 'next' };

beforeEach(() => {
  disableBack.add = jest.fn();
  disableBack.remove = jest.fn();
  next.mockReturnValue(nextResult);
  (useLogoutOnBack as jest.Mock).mockReturnValue(back);
});

it('renders correctly', () => {
  renderWithContext(<GetStartedScreen next={next} />, {
    initialState,
  }).snapshot();
});

it('renders without back button correctly', () => {
  (useLogoutOnBack as jest.Mock).mockReturnValue(null);

  renderWithContext(<GetStartedScreen next={next} enableBackButton={false} />, {
    initialState,
  }).snapshot();
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

      fireEvent.press(getByTestId('BackButton'));

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

      fireEvent.press(getByTestId('BackButton'));

      expect(useLogoutOnBack).toHaveBeenCalledWith(true, true);
      expect(back).toHaveBeenCalledWith();
    });
  });
});
