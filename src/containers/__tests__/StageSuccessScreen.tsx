import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import StageSuccessScreen from '../StageSuccessScreen';
import { renderWithContext } from '../../../testUtils';
import { navigatePush } from '../../actions/navigation';

jest.mock('../../actions/navigation');

const mockState = {
  auth: {
    person: { first_name: 'Test Fname', user: { pathway_stage_id: '1' } },
  },
  stages: {
    stages: [
      {
        id: '1',
        self_followup_description: 'We are glad you are here, <<user>>!',
      },
    ],
  },
};

jest.mock('react-native-device-info');
const next = jest.fn().mockReturnValue({ type: 'next ' });

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue({ type: 'navigatePush' });
  next.mockReturnValue({ type: 'next' });
});

it('renders correctly', () => {
  renderWithContext(<StageSuccessScreen next={next} />, {
    initialState: mockState,
  }).snapshot();
});

it('renders correctly with default state', () => {
  renderWithContext(<StageSuccessScreen next={next} />, {
    initialState: mockState,
  }).snapshot();
});

it('calls next with selected stage', () => {
  const { getByTestId } = renderWithContext(
    <StageSuccessScreen next={next} />,
    {
      initialState: mockState,
    },
  );
  fireEvent(getByTestId('IconMessageScreen'), 'onComplete');
  expect(next).toHaveBeenCalledWith();
});
