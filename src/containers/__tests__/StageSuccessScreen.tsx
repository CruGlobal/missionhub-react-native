import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import StageSuccessScreen from '../StageSuccessScreen';
import { renderWithContext } from '../../../testUtils';
import { navigatePush } from '../../actions/navigation';
import { useTrackScreenChange } from '../../utils/hooks/useTrackScreenChange';

jest.mock('react-native-device-info');
jest.mock('../../actions/navigation');
jest.mock('../../utils/hooks/useTrackScreenChange');

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

const next = jest.fn();

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue({ type: 'navigatePush' });
  next.mockReturnValue({ type: 'next' });
  (useTrackScreenChange as jest.Mock).mockClear();
});

it('renders correctly', () => {
  renderWithContext(<StageSuccessScreen next={next} />, {
    initialState: mockState,
  }).snapshot();
});

it('tracks screen change on mount', () => {
  renderWithContext(<StageSuccessScreen next={next} />, {
    initialState: mockState,
  });

  expect(useTrackScreenChange).toHaveBeenCalledWith([
    'onboarding',
    'stage confirmation',
  ]);
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
