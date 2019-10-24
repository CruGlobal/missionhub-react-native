import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { ADD_SOMEONE_STEP_FLOW } from '../../../routes/constants';

import TakeAStepWithSomeoneButton from '..';

jest.mock('../../../actions/navigation');

navigatePush.mockReturnValue({ type: 'navigate push' });

it('renders correctly', () => {
  renderWithContext(<TakeAStepWithSomeoneButton />).snapshot();
});

it('calls navigate push', () => {
  const { getByTestId } = renderWithContext(<TakeAStepWithSomeoneButton />);
  fireEvent.press(getByTestId('TakeAStepWithSomeoneButton'));

  expect(navigatePush).toHaveBeenCalledWith(ADD_SOMEONE_STEP_FLOW);
});
