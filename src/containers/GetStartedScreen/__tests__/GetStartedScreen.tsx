import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { disableBack } from '../../../utils/common';

import GetStartedScreen from '..';

jest.mock('react-native-device-info');
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

beforeEach(() => {
  disableBack.add = jest.fn();
  disableBack.remove = jest.fn();
  next.mockReturnValue(nextResult);
});

it('renders correctly', () => {
  renderWithContext(<GetStartedScreen next={next} />, {
    initialState,
  }).snapshot();
});

it('disables back on mount', () => {
  renderWithContext(<GetStartedScreen next={next} />, {
    initialState,
  });

  expect(disableBack.add).toHaveBeenCalledWith();
});

it('navigates to next screen', () => {
  const { getByTestId, store } = renderWithContext(
    <GetStartedScreen next={next} />,
    {
      initialState,
    },
  );

  fireEvent.press(getByTestId('bottomButton'));

  expect(disableBack.remove).toHaveBeenCalledWith();
  expect(next).toHaveBeenCalledWith({ id });
  expect(store.getActions()).toEqual([nextResult]);
});
