import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fireEvent } from 'react-native-testing-library';

import TakeAStepWithSomeoneButton from '..';

import { renderWithContext } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { ADD_SOMEONE_STEP_FLOW } from '../../../routes/constants';

jest.mock('../../../actions/navigation');

const mockStore = configureStore([thunk]);
navigatePush.mockReturnValue({ type: 'navigate push' });

it('renders correctly', () => {
  renderWithContext(<TakeAStepWithSomeoneButton />, {
    store: mockStore({ personProfile: { hasNotCreatedStep: false } }),
  }).snapshot();
});

it('calls navigate push', () => {
  const { getByTestId } = renderWithContext(<TakeAStepWithSomeoneButton />, {
    store: mockStore({ personProfile: { hasNotCreatedStep: false } }),
  });
  fireEvent.press(getByTestId('TakeAStepWithSomeoneButton'));

  expect(navigatePush).toHaveBeenCalledWith(ADD_SOMEONE_STEP_FLOW);
});
