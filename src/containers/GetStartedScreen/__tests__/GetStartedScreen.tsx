import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { disableBack } from '../../../utils/common';

import GetStartedScreen from '..';

jest.mock('react-native-device-info');
jest.mock('../../../utils/common');

const initialState = {
  profile: {
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
    navParams: {},
  }).snapshot();
});

it('renders without back button correctly', () => {
  renderWithContext(<GetStartedScreen next={next} />, {
    initialState,
    navParams: { enableBackButton: false },
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

  expect(next).toHaveBeenCalledWith();
  expect(store.getActions()).toEqual([nextResult]);
});
